const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function cropWhiteBorder(inputPath, outputPath) {
  try {
    // 读取图片
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // 获取图片数据
    const { data, info } = await image
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true });
    
    const width = info.width;
    const height = info.height;
    const channels = info.channels;
    
    // 检测白色边框的阈值（接近白色的像素）
    const whiteThreshold = 250; // RGB 值都大于 250 认为是白色
    
    // 从边缘向内检测，找到第一个非白色像素
    let minX = 0;
    let minY = 0;
    let maxX = width - 1;
    let maxY = height - 1;
    
    // 从左边检测
    for (let x = 0; x < width; x++) {
      let foundNonWhite = false;
      for (let y = 0; y < height; y++) {
        const idx = (y * width + x) * channels;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = channels === 4 ? data[idx + 3] : 255;
        
        if (a > 0 && (r < whiteThreshold || g < whiteThreshold || b < whiteThreshold)) {
          foundNonWhite = true;
          break;
        }
      }
      if (foundNonWhite) {
        minX = x;
        break;
      }
    }
    
    // 从右边检测
    for (let x = width - 1; x >= minX; x--) {
      let foundNonWhite = false;
      for (let y = 0; y < height; y++) {
        const idx = (y * width + x) * channels;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = channels === 4 ? data[idx + 3] : 255;
        
        if (a > 0 && (r < whiteThreshold || g < whiteThreshold || b < whiteThreshold)) {
          foundNonWhite = true;
          break;
        }
      }
      if (foundNonWhite) {
        maxX = x;
        break;
      }
    }
    
    // 从顶部检测
    for (let y = 0; y < height; y++) {
      let foundNonWhite = false;
      for (let x = minX; x <= maxX; x++) {
        const idx = (y * width + x) * channels;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = channels === 4 ? data[idx + 3] : 255;
        
        if (a > 0 && (r < whiteThreshold || g < whiteThreshold || b < whiteThreshold)) {
          foundNonWhite = true;
          break;
        }
      }
      if (foundNonWhite) {
        minY = y;
        break;
      }
    }
    
    // 从底部检测
    for (let y = height - 1; y >= minY; y--) {
      let foundNonWhite = false;
      for (let x = minX; x <= maxX; x++) {
        const idx = (y * width + x) * channels;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = channels === 4 ? data[idx + 3] : 255;
        
        if (a > 0 && (r < whiteThreshold || g < whiteThreshold || b < whiteThreshold)) {
          foundNonWhite = true;
          break;
        }
      }
      if (foundNonWhite) {
        maxY = y;
        break;
      }
    }
    
    // 添加一些边距（可选，这里不加边距）
    const cropWidth = maxX - minX + 1;
    const cropHeight = maxY - minY + 1;
    
    console.log(`检测到内容区域: x=${minX}, y=${minY}, width=${cropWidth}, height=${cropHeight}`);
    
    // 裁剪图片
    await sharp(inputPath)
      .extract({
        left: minX,
        top: minY,
        width: cropWidth,
        height: cropHeight
      })
      .toFile(outputPath);
    
    console.log(`图片已裁剪并保存到: ${outputPath}`);
  } catch (error) {
    console.error('处理图片时出错:', error);
    throw error;
  }
}

// 执行裁剪
const inputPath = path.join(__dirname, '../public/img/headedImg.png');
const tempPath = path.join(__dirname, '../public/img/headedImg-temp.png');
const outputPath = path.join(__dirname, '../public/img/headedImg.png');

cropWhiteBorder(inputPath, tempPath).then(() => {
  // 删除原文件并重命名临时文件
  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath);
  }
  fs.renameSync(tempPath, outputPath);
  console.log('完成！');
}).catch(error => {
  console.error('错误:', error);
  process.exit(1);
});
