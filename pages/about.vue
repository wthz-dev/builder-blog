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
  description: 'เรียนรู้เกี่ยวกับ WhiteBikeVibes - ชุมชนของคนรักบิ๊กไบค์และนักพัฒนาซอฟต์แวร์',
  ogDescription: 'เรียนรู้เกี่ยวกับ WhiteBikeVibes - ชุมชนของคนรักบิ๊กไบค์และนักพัฒนาซอฟต์แวร์',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image',
})
</script>
