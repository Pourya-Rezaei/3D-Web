import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUT_DIR = '/home/z/my-project/public/watches';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

type Job = {
  name: string;
  size: string;
  prompt: string;
};

const jobs: Job[] = [
  {
    name: 'watch-3.png',
    size: '1024x1024',
    prompt:
      'Luxury skeleton tourbillon wristwatch with transparent dial showing intricate gears, platinum case, black leather strap, isolated on pure black background, dramatic studio lighting, ultra detailed, premium advertisement',
  },
  {
    name: 'watch-4.png',
    size: '1024x1024',
    prompt:
      'Luxury chronograph wristwatch with silver dial, gold accents, brown alligator strap, isolated on pure black background, professional studio product photography, ultra detailed, premium advertisement style',
  },
  {
    name: 'watch-5.png',
    size: '1024x1024',
    prompt:
      'Luxury minimalist wristwatch with white mother of pearl dial, slim rose gold case, white leather strap, isolated on pure black background, professional studio product photography, ultra detailed, premium advertisement',
  },
  {
    name: 'watch-6.png',
    size: '1024x1024',
    prompt:
      'Luxury aviation pilot watch with black dial, large luminous numerals, steel case, brown vintage leather strap, isolated on pure black background, professional studio product photography, ultra detailed, premium advertisement',
  },
  {
    name: 'atelier.png',
    size: '1344x768',
    prompt:
      'Master watchmaker hands assembling tiny gears of luxury watch with tweezers under warm focused light, dark moody atelier background, intricate mechanical parts, cinematic depth of field, ultra detailed, premium craftsmanship photography',
  },
  {
    name: 'texture-bg.png',
    size: '1440x720',
    prompt:
      'Abstract dark luxury background, brushed gold and black metal texture, subtle carbon fiber pattern, soft cinematic lighting from top, premium minimal, ultra detailed, 8k',
  },
];

async function genOne(zai: any, job: Job) {
  const outPath = path.join(OUT_DIR, job.name);
  if (fs.existsSync(outPath)) {
    console.log(`skip (exists): ${job.name}`);
    return;
  }
  console.log(`generating: ${job.name} (${job.size})`);
  const response = await zai.images.generations.create({
    prompt: job.prompt,
    size: job.size as any,
  });
  const b64 = response.data[0].base64;
  const buf = Buffer.from(b64, 'base64');
  fs.writeFileSync(outPath, buf);
  console.log(`saved: ${outPath} (${(buf.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  const zai = await ZAI.create();
  for (const job of jobs) {
    try {
      await genOne(zai, job);
    } catch (e: any) {
      console.error(`failed ${job.name}: ${e?.message ?? e}`);
    }
  }
  console.log('DONE');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
