<script setup lang="ts"></script>

<template>
  <section class="container py-16">
    <div class="mx-auto max-w-2xl text-center">
      <h1 class="font-display text-3xl font-bold text-ink-900">About Me</h1>
      <div class="mt-4 space-y-6 text-left text-ink-700">
        <div>
          <h2 class="font-semibold text-ink-900">Profile</h2>
          <ul class="mt-2 list-disc pl-5">
            <li><span class="font-medium">Name:</span> Torkait Sukpramote</li>
            <li><span class="font-medium">Profession:</span> Senior Software Developer</li>
            <li>
              <span class="font-medium">Hobbies:</span> Assembling model cars, remote control drift cars
            </li>
          </ul>
          <p class="mt-2 text-ink-600">
            This blog is about sharing my journey in tech, design, and retro gaming.
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-ink-900">Bigbike Passion</h2>
          <p class="mt-2 text-ink-700">
            ผมมีใจรักในการขี่ Bigbike เพราะมันผสมผสานความอิสระ ความท้าทาย และสมรรถนะทางวิศวกรรมไว้ด้วยกัน
            เวลาออกทริปยาว ๆ ได้สัมผัสทั้งแรงบิด การควบคุม และเส้นทางใหม่ ๆ ทำให้ได้รีเซ็ตความคิดและได้แรงบันดาลใจกลับมาทำงานเสมอ
            ผมสนุกกับการดูแลรถ ปรับเซ็ตช่วงล่าง ยาง และเบรกให้เหมาะกับสไตล์การขี่ของตัวเอง รวมถึงศึกษาด้านความปลอดภัยและเทคนิคการขี่เชิงลึกอยู่ตลอดเวลา
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-ink-900">Skills</h2>
          <div class="mt-2 grid gap-4 sm:grid-cols-2">
            <div>
              <h3 class="text-sm font-semibold text-ink-800">Backend Development</h3>
              <ul class="mt-1 list-disc pl-5 text-sm">
                <li>Node.js, NestJS, Prisma, Sequelize</li>
                <li>Golang, .NET Core, PHP</li>
              </ul>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-ink-800">Architecture & Microservices</h3>
              <ul class="mt-1 list-disc pl-5 text-sm">
                <li>
                  API Gateway: Nginx as reverse proxy, SSL termination, and front-line routing
                  (<code>certs-rtb/nginx.conf</code>)
                </li>
                <li>
                  Observability (Logging/Metrics/Uptime): Loki + Promtail (logs), Grafana (dashboards),
                  Uptime Kuma (uptime). Distributed Tracing: not yet enabled
                </li>
                <li>
                  Services: Multiple Node.js/Express services behind Nginx, using MariaDB + Redis
                </li>
                <li>
                  API Documentation: Swagger per service
                </li>
                <li>
                  Cross-cutting concerns per service: CORS, Rate Limit, Health Check endpoints
                </li>
              </ul>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-ink-800">Database Management</h3>
              <ul class="mt-1 list-disc pl-5 text-sm">
                <li>PostgreSQL, MySQL, MariaDB, MongoDB</li>
              </ul>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-ink-800">Frontend Development</h3>
              <ul class="mt-1 list-disc pl-5 text-sm">
                <li>Vue.js, Nuxt.js, React.js, Next.js</li>
                <li>JavaScript, TypeScript</li>
              </ul>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-ink-800">Real-Time Communication</h3>
              <ul class="mt-1 list-disc pl-5 text-sm">
                <li>Socket.io, WebSocket</li>
              </ul>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-ink-800">DevOps & Deployment</h3>
              <ul class="mt-1 list-disc pl-5 text-sm">
                <li>Docker, PM2, Nginx</li>
                <li>Ubuntu Server, AWS EC2</li>
                <li>SSL Certificate Config, DNS Configuration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
