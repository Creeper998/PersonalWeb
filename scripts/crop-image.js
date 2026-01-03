const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function cropWhiteBorder(inputPath, outputPath) {
  try {
    // 读取图片数据进行分析
    const image = sharp(inputPath);
    const { data, info } = await image
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true });
    
    const width = info.width;
    const height = info.height;
    const channels = info.channels;
    
    // 检测浅色边框（包括白色和浅灰色）
    // 阈值：RGB 值都大于 150 认为是浅色边框（更激进，能裁剪更多浅色区域）
    const lightThreshold = 150;
    
    // 找到所有非浅色像素的边界（实际内容区域）
    let minX = width;
    let minY = height;
    let maxX = 0;
    let maxY = 0;
    let foundContent = false;
    
    // 遍历所有像素，找到非浅色像素的边界
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * channels;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = channels === 4 ? data[idx + 3] : 255;
        
        // 如果像素不是浅色（RGB 任一值小于阈值）且不透明，认为是内容
        if (a > 0 && (r < lightThreshold || g < lightThreshold || b < lightThreshold)) {
          foundContent = true;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    
    if (foundContent) {
      const cropWidth = maxX - minX + 1;
      const cropHeight = maxY - minY + 1;
      
      console.log(`检测到内容区域: x=${minX}, y=${minY}, width=${cropWidth}, height=${cropHeight}`);
      
      await sharp(inputPath)
        .extract({
          left: minX,
          top: minY,
          width: cropWidth,
          height: cropHeight
        })
        .toFile(outputPath);
      
      const metadata = await sharp(outputPath).metadata();
      console.log(`图片已裁剪并保存到: ${outputPath}`);
      console.log(`新尺寸: ${metadata.width}x${metadata.height}`);
    } else {
      console.log('未检测到内容区域');
      const originalBuffer = await sharp(inputPath).toBuffer();
      await sharp(originalBuffer).toFile(outputPath);
    }
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














