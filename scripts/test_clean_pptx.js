import pptxgen from 'pptxgenjs';
import path from 'path';

async function testClean() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9'; // 10 x 5.625 or 13.33 x 7.5

  const slide = pptx.addSlide();
  slide.background = { color: '090D16' };

  slide.addText('FitHome', {
    x: 1.0,
    y: 1.0,
    w: 11.0,
    h: 1.0,
    fontSize: 44,
    bold: true,
    color: 'FFFFFF'
  });

  const outputPath = path.resolve('public', 'test_clean.pptx');
  await pptx.writeFile({ fileName: outputPath });
  console.log('Clean test generated at:', outputPath);
}

testClean().catch(console.error);
