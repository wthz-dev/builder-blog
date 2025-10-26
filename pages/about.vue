<template>
  <div class="container mx-auto px-4 py-16">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-4xl font-bold text-ink-900 mb-8">เกี่ยวกับเรา</h1>
      
      <div class="prose prose-ink max-w-none">
        <p class="text-xl text-ink-600 mb-8">
          WhiteBikeVibes เป็นบล็อกที่รวบรวมเรื่องราวของ Bigbike และ Developer Lifestyle
        </p>
        
        <h2>เกี่ยวกับ WhiteBikeVibes</h2>
        <p>
          เราเป็นชุมชนของคนรักมอเตอร์ไซค์บิ๊กไบค์และนักพัฒนาซอฟต์แวร์ที่มาแบ่งปันประสบการณ์ 
          เรื่องราว และความรู้เกี่ยวกับโลกของบิ๊กไบค์และการพัฒนาซอฟต์แวร์
        </p>
        
        <h2>สิ่งที่เราแบ่งปัน</h2>
        <ul>
          <li>รีวิวมอเตอร์ไซค์บิ๊กไบค์</li>
          <li>เทคนิคการขับขี่</li>
          <li>เส้นทางท่องเที่ยวด้วยมอเตอร์ไซค์</li>
          <li>เทคโนโลยีและการพัฒนาซอฟต์แวร์</li>
          <li>ไลฟ์สไตล์ของนักพัฒนา</li>
        </ul>
        
        <h2>เกี่ยวกับ WhiteBikeVibes</h2>
        <p>
          <strong>WhiteBikeVibes</strong> คือแบรนด์คอนเทนต์ไลฟ์สไตล์สายสองล้อ โดย
          <strong>คุณไวท์ (White)</strong> ถ่ายทอดพลังบวก แรงบันดาลใจ และเสน่ห์การเดินทางด้วยมอเตอร์ไซค์/สกู๊ตเตอร์
        </p>

        <p><strong>แพลตฟอร์มหลัก</strong></p>
        <ul>
          <li>
            <div class="flex items-center gap-2">
              <Icon name="simple-icons:tiktok" size="18" class="text-brand-600" />
              <strong>TikTok:</strong>
              <a href="https://www.tiktok.com/@whitez52" class="text-brand-600 hover:text-brand-700" target="_blank" rel="noopener">@whitez52</a>
              — วิดีโอสั้นพลังบวกและบรรยากาศการขับขี่
            </div>
          </li>
          <li>
            <div class="flex items-center gap-2">
              <Icon name="lucide:globe" size="18" class="text-brand-600" />
              <strong>Website:</strong>
              <a href="https://whitebikevibes.space/" class="text-brand-600 hover:text-brand-700" target="_blank" rel="noopener">whitebikevibes.space</a>
              — บทความ ภาพ และเรื่องราวการเดินทาง
            </div>
          </li>
        </ul>

        <div class="mt-4 flex flex-wrap gap-3">
          <a
            href="https://www.tiktok.com/@whitez52"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            <Icon name="simple-icons:tiktok" size="18" />
            ติดตามบน TikTok
          </a>
          <a
            href="https://whitebikevibes.space/"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 rounded-md border border-ink-200 px-4 py-2 text-ink-800 hover:bg-ink-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            <Icon name="lucide:globe" size="18" />
            เยี่ยมชมเว็บไซต์
          </a>
        </div>

        <p><strong>เนื้อหาและจุดเด่น</strong></p>
        <ul>
          <li><strong>Positive Vibes & Lifestyle:</strong> เล่าประสบการณ์กับคู่ใจ <strong>Ducati Monster 795</strong> และ <strong>Vespa S125</strong></li>
          <li><strong>รีวิวใช้งานจริง:</strong> รีวิวอุปกรณ์/สินค้าเกี่ยวกับยานยนต์บน <strong>TikTok Shop</strong> เน้นคุณภาพและความจริงใจ</li>
          <li><strong>คุณค่าและความน่าเชื่อถือ:</strong> คัดสรรคอนเทนต์ที่เป็นประโยชน์ต่อผู้ติดตาม</li>
        </ul>

        <p>
          มุ่งสร้างชุมชนคนรักสายสองล้อที่เต็มไปด้วยแรงบันดาลใจ และข้อมูลที่เชื่อถือได้
        </p>
        
        <h2>ติดต่อเรา</h2>
        <p>
          หากคุณมีคำถาม ข้อเสนอแนะ หรือต้องการร่วมเขียนบทความกับเรา 
          สามารถติดต่อเราได้ผ่านหน้า <NuxtLink to="/contact" class="text-brand-600 hover:text-brand-700">ติดต่อ</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'เกี่ยวกับเรา • WhiteBikeVibes',
  ogTitle: 'เกี่ยวกับเรา • WhiteBikeVibes',
  description: 'WhiteBikeVibes: คอนเทนต์ไลฟ์สไตล์สายสองล้อ TikTok @whitez52 รีวิวสินค้าใช้งานจริง Ducati Monster 795, Vespa S125 และบทความเดินทาง',
  ogDescription: 'WhiteBikeVibes: ไลฟ์สไตล์มอเตอร์ไซค์ รีวิวจริงบน TikTok @whitez52 Ducati Monster 795, Vespa S125 และเรื่องราวการเดินทาง',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image',
  keywords: 'WhiteBikeVibes, TikTok @whitez52, Ducati Monster 795, Vespa S125, รีวิวสินค้า, มอเตอร์ไซค์, สกู๊ตเตอร์, ไลฟ์สไตล์, บทความท่องเที่ยว'
})
</script>
