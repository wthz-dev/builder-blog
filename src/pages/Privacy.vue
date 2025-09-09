<script setup lang="ts">
import { onMounted } from 'vue'
import { useSeo } from '@/composables/useSeo'

onMounted(() => {
  useSeo({
    title: 'Privacy Policy',
    description:
      'Learn how WhiteBikeVibes collects, uses, and protects your information, including analytics cookies and contact data.',
    type: 'website',
    url: '/privacy-policy',
  })
})
</script>

<template>
  <section class="container max-w-3xl py-10">
    <h1 class="font-display text-3xl font-bold text-ink-900 md:text-4xl">Privacy Policy</h1>
    <p class="mt-2 text-sm text-ink-500">Last updated: {{ new Date().toLocaleDateString() }}</p>

    <div class="prose prose-ink mt-6 max-w-none">
      <p>
        This Privacy Policy describes how we collect, use, and share information when you
        visit or interact with WhiteBikeVibes (the "Site"). By using the Site, you agree to the
        collection and use of information in accordance with this policy.
      </p>

      <h2>Information We Collect</h2>
      <ul>
        <li>
          <strong>Usage Data</strong>: We use Google Analytics (GA4) to collect anonymized usage
          information such as page views, device information, approximate location, and referral
          sources. This data helps us improve the Site.
        </li>
        <li>
          <strong>Comments and Forms</strong>: If you submit comments or contact forms, we may
          collect your name, email, and the content you submit.
        </li>
        <li>
          <strong>Cookies</strong>: The Site may store cookies to remember preferences and support
          analytics. You can disable cookies in your browser settings at any time.
        </li>
      </ul>

      <h2>How We Use Information</h2>
      <ul>
        <li>To operate, maintain, and improve the Site and its content.</li>
        <li>To analyze traffic and user interactions using Google Analytics.</li>
        <li>To communicate with you if you contact us.</li>
      </ul>

      <h2>Google Analytics</h2>
      <p>
        We use Google Analytics (gtag.js) on this Site. Google may collect data as described in
        its own privacy policy. For more information and how to opt out, visit
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google Privacy Policy</a>
        and
        <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">Google Analytics Opt-out</a>.
      </p>

      <h2>Data Sharing</h2>
      <p>
        We do not sell your personal information. We may share limited data with service providers
        (e.g., hosting, analytics) solely to operate the Site.
      </p>

      <h2>Data Retention</h2>
      <p>
        We retain information only for as long as necessary to fulfill the purposes outlined in
        this policy unless a longer retention period is required by law.
      </p>

      <h2>Your Choices</h2>
      <ul>
        <li>You can disable cookies in your browser settings.</li>
        <li>You can request deletion of comments or data you submitted by contacting us.</li>
      </ul>

      <h2>Contact</h2>
      <p>
        If you have questions about this Privacy Policy, please contact us via the contact page or
        email listed on the Site.
      </p>
    </div>
  </section>
</template>
