# UI 优化实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 实现简历网站的 UI 优化，包括 Hero 动画、卡片动效、导航增强和功能完善

**Architecture:** 渐进增强方案，优先使用 CSS 动画 + Intersection Observer API，保持 Astro 静态架构

**Tech Stack:** Astro 5.x, Tailwind CSS 3.x, TypeScript, Intersection Observer API

---

## 阶段一：Hero 动画 + 卡片动效（P0）

### Task 1: 添加全局动画样式

**Files:**
- Modify: `src/styles/global.css`

**Step 1: 添加动画 keyframes**

在 `src/styles/global.css` 末尾添加：

```css
/* ========== 动画定义 ========== */

/* 头像光晕呼吸动画 */
@keyframes avatar-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(99, 102, 241, 0.5);
  }
}

/* 文字渐入动画 */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 逐字渐入延迟类 */
@keyframes char-fade {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 卡片滚动进入动画 */
@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 打字机光标闪烁 */
@keyframes cursor-blink {
  0%, 50% {
    border-color: currentColor;
  }
  51%, 100% {
    border-color: transparent;
  }
}

/* ========== 动画工具类 ========== */

.animate-glow {
  animation: avatar-glow 3s ease-in-out infinite;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

.animate-char {
  animation: char-fade 0.4s ease-out forwards;
  opacity: 0;
}

.animate-card-enter {
  animation: card-enter 0.5s ease-out forwards;
}

/* 滚动触发动画初始状态 */
.scroll-animate {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}

.scroll-animate.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* 交错动画延迟 */
.stagger-1 { transition-delay: 0.1s; }
.stagger-2 { transition-delay: 0.2s; }
.stagger-3 { transition-delay: 0.3s; }
.stagger-4 { transition-delay: 0.4s; }
.stagger-5 { transition-delay: 0.5s; }
.stagger-6 { transition-delay: 0.6s; }
```

**Step 2: 验证样式生效**

Run: `npm run dev`
Expected: 开发服务器启动，访问 http://localhost:4321 页面正常加载

**Step 3: 提交**

```bash
git add src/styles/global.css
git commit -m "style: 添加全局动画 keyframes 和工具类"
```

---

### Task 2: Hero 头像动画

**Files:**
- Modify: `src/components/Hero.astro:12-16`

**Step 1: 添加头像动画类**

修改 `src/components/Hero.astro` 中头像的 class：

```astro
<!-- 原代码 -->
<img
  src="/assets/avatar.jpg"
  alt="江斌"
  class="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white dark:border-slate-700 shadow-lg object-cover"
/>

<!-- 改为 -->
<img
  src="/assets/avatar.jpg"
  alt="江斌"
  class="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white dark:border-slate-700 shadow-lg object-cover animate-glow hover:scale-105 transition-transform duration-300"
/>
```

**Step 2: 验证效果**

Run: 刷新页面
Expected: 头像有柔和的 indigo 色光晕呼吸效果，悬停时轻微放大

**Step 3: 提交**

```bash
git add src/components/Hero.astro
git commit -m "feat(hero): 添加头像光晕呼吸动画"
```

---

### Task 3: Hero 姓名逐字渐入动画

**Files:**
- Modify: `src/components/Hero.astro:18-20`

**Step 1: 修改姓名为逐字动画**

```astro
<!-- 原代码 -->
<h1 class="text-5xl font-bold mb-4 text-slate-900 dark:text-slate-100">江斌</h1>

<!-- 改为 -->
<h1 class="text-5xl font-bold mb-4 text-slate-900 dark:text-slate-100 flex justify-center">
  <span class="animate-char" style="animation-delay: 0.1s">江</span>
  <span class="animate-char" style="animation-delay: 0.2s">斌</span>
</h1>
```

**Step 2: 验证效果**

Run: 刷新页面
Expected: 姓名两个字依次从下方渐入，有 0.1s 的延迟差

**Step 3: 提交**

```bash
git add src/components/Hero.astro
git commit -m "feat(hero): 添加姓名逐字渐入动画"
```

---

### Task 4: Hero 职位打字机效果

**Files:**
- Modify: `src/components/Hero.astro:21-23`

**Step 1: 修改职位显示结构**

```astro
<!-- 原代码 -->
<p class="text-xl text-slate-600 dark:text-slate-400 mb-2">AI 应用工程师 / Python 后端开发工程师</p>

<!-- 改为 -->
<p class="text-xl text-slate-600 dark:text-slate-400 mb-2 h-8">
  <span id="typewriter"></span>
  <span class="inline-block w-0.5 h-6 bg-slate-600 dark:bg-slate-400 ml-1 align-middle" style="animation: cursor-blink 1s infinite"></span>
</p>
```

**Step 2: 添加打字机脚本**

在 Hero.astro 底部 `<script>` 标签内添加：

```javascript
// 打字机效果
const titles = [
  'AI 应用工程师',
  'Python 后端开发工程师',
  '全栈工程师',
];

const typewriterEl = document.getElementById('typewriter');
let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
  const currentTitle = titles[titleIndex];

  if (isDeleting) {
    typewriterEl.textContent = currentTitle.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 50;
  } else {
    typewriterEl.textContent = currentTitle.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 100;
  }

  if (!isDeleting && charIndex === currentTitle.length) {
    typeSpeed = 2000; // 停顿
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    titleIndex = (titleIndex + 1) % titles.length;
    typeSpeed = 500;
  }

  setTimeout(type, typeSpeed);
}

// 页面加载后启动
setTimeout(type, 1000);
```

**Step 3: 验证效果**

Run: 刷新页面
Expected: 职位文字逐字打出，完成后停顿 2 秒，然后逐字删除，循环显示 3 个职位

**Step 4: 提交**

```bash
git add src/components/Hero.astro
git commit -m "feat(hero): 添加职位打字机循环效果"
```

---

### Task 5: Hero 按钮悬停动效

**Files:**
- Modify: `src/components/Hero.astro:33-47`

**Step 1: 增强按钮悬停效果**

```astro
<!-- 原代码 -->
<div class="flex justify-center gap-4 flex-wrap">
  <a href="https://github.com/jiangbingo" target="_blank"
     class="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition">
    GitHub
  </a>
  <button id="wechat-btn"
     class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
    微信
  </button>
  <a href="mailto:jiangbingo@hotmail.com"
     class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition dark:text-slate-300">
    Email
  </a>
</div>

<!-- 改为 -->
<div class="flex justify-center gap-4 flex-wrap animate-fade-in-up" style="animation-delay: 0.5s">
  <a href="https://github.com/jiangbingo" target="_blank"
     class="px-5 py-2.5 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex items-center gap-2">
    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
    GitHub
  </a>
  <button id="wechat-btn"
     class="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:-translate-y-1 hover:shadow-lg hover:bg-green-700 transition-all duration-300 flex items-center gap-2">
    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.49.49 0 01-.011-.153.49.49 0 01.193-.39C23.267 17.792 24 16.382 24 14.833c0-3.37-3.247-6.03-7.062-5.975zM14.18 13.178c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982z"/></svg>
    微信
  </button>
  <a href="mailto:jiangbingo@hotmail.com"
     class="px-5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg hover:-translate-y-1 hover:shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 dark:text-slate-300 flex items-center gap-2">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
    Email
  </a>
</div>
```

**Step 2: 验证效果**

Run: 刷新页面
Expected: 按钮整体渐入，悬停时上浮 + 阴影，有图标显示

**Step 3: 提交**

```bash
git add src/components/Hero.astro
git commit -m "feat(hero): 增强按钮悬停动效和图标"
```

---

### Task 6: 技能卡片悬停动效

**Files:**
- Modify: `src/components/SkillCard.astro`

**Step 1: 增强卡片样式**

```astro
---
// src/components/SkillCard.astro
interface Props {
  icon: string;
  title: string;
  skills: string[];
}

const { icon, title, skills } = Astro.props;
---

<div class="group bg-white dark:bg-slate-700 rounded-xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-indigo-400 dark:hover:border-indigo-500 cursor-default">
  <div class="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
  <h3 class="text-lg font-semibold mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{title}</h3>
  <div class="flex flex-wrap gap-2">
    {skills.map((skill) => (
      <span class="px-2 py-1 bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300 text-sm rounded group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors duration-300">
        {skill}
      </span>
    ))}
  </div>
</div>
```

**Step 2: 验证效果**

Run: 刷新页面
Expected: 卡片悬停时上浮、阴影加深、边框变色、图标放大、标签变色

**Step 3: 提交**

```bash
git add src/components/SkillCard.astro
git commit -m "feat(skill-card): 增强悬停动效"
```

---

### Task 7: 项目卡片悬停动效

**Files:**
- Modify: `src/components/ProjectCard.astro`

**Step 1: 增强卡片样式**

```astro
---
// src/components/ProjectCard.astro
interface Props {
  title: string;
  description: string;
  tech: string[];
  metrics: { label: string; value: string }[];
  link?: string;
}

const { title, description, tech, metrics, link } = Astro.props;
---

<div class="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer hover:-translate-y-1">
  <!-- 顶部渐变装饰 -->
  <div class="h-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 opacity-60 group-hover:opacity-100 transition-opacity"></div>

  <div class="p-6">
    <h3 class="text-xl font-semibold mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{title}</h3>
    <p class="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{description}</p>

    <!-- 技术标签 -->
    <div class="flex flex-wrap gap-2 mb-4">
      {tech.map((t) => (
        <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm rounded transition-transform group-hover:scale-105">
          {t}
        </span>
      ))}
    </div>

    <!-- 指标 -->
    <div class="grid grid-cols-2 gap-4 text-center border-t border-slate-200 dark:border-slate-700 pt-4">
      {metrics.map((m) => (
        <div class="group/metric">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400 group-hover/metric:text-indigo-600 dark:group-hover/metric:text-indigo-400 transition-colors">{m.value}</div>
          <div class="text-sm text-slate-500 dark:text-slate-400">{m.label}</div>
        </div>
      ))}
    </div>

    {link && (
      <a href={link} class="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
        查看详情 →
      </a>
    )}
  </div>
</div>
```

**Step 2: 验证效果**

Run: 刷新页面
Expected: 卡片悬停时上浮、阴影加深、顶部渐变显现、标题变色

**Step 3: 提交**

```bash
git add src/components/ProjectCard.astro
git commit -m "feat(project-card): 增强悬停动效和顶部渐变装饰"
```

---

### Task 8: 卡片滚动进入动画

**Files:**
- Modify: `src/components/Skills.astro`
- Modify: `src/components/Projects.astro`

**Step 1: 为 Skills 区域添加滚动动画**

修改 `src/components/Skills.astro`：

```astro
---
// src/components/Skills.astro
import SkillCard from './SkillCard.astro';

const skillGroups = [
  // ... 保持现有数据
];
---

<section id="skills" class="py-20 bg-slate-100 dark:bg-slate-800">
  <div class="container mx-auto px-6">
    <h2 class="text-3xl font-bold text-center mb-12 scroll-animate">核心能力</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {skillGroups.map((group, index) => (
        <div class="scroll-animate stagger-{index + 1}">
          <SkillCard {...group} />
        </div>
      ))}
    </div>
  </div>
</section>

<script>
  // Intersection Observer 滚动动画
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.scroll-animate').forEach((el) => {
    observer.observe(el);
  });
</script>
```

**Step 2: 为 Projects 区域添加滚动动画**

修改 `src/components/Projects.astro`：

```astro
---
// src/components/Projects.astro
import ProjectCard from './ProjectCard.astro';

const projects = [
  // ... 保持现有数据
];
---

<section id="projects" class="py-20">
  <div class="container mx-auto px-6">
    <h2 class="text-3xl font-bold text-center mb-12 scroll-animate">代表项目</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
      {projects.map((project, index) => (
        <div class="scroll-animate stagger-{index + 1}">
          <ProjectCard {...project} />
        </div>
      ))}
    </div>
  </div>
</section>

<script>
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.scroll-animate').forEach((el) => {
    observer.observe(el);
  });
</script>
```

**Step 3: 验证效果**

Run: 刷新页面，滚动到技能和项目区域
Expected: 卡片依次从下方渐入，有交错延迟效果

**Step 4: 提交**

```bash
git add src/components/Skills.astro src/components/Projects.astro
git commit -m "feat: 添加卡片滚动进入动画"
```

---

## 阶段二：导航增强（P1）

### Task 9: 创建独立导航组件

**Files:**
- Create: `src/components/Navbar.astro`

**Step 1: 创建导航组件**

```astro
---
// src/components/Navbar.astro
import ThemeToggle from './ThemeToggle.astro';
import Search from './Search.astro';

const navItems = [
  { href: '#hero', label: '首页' },
  { href: '#skills', label: '核心能力' },
  { href: '#projects', label: '代表项目' },
  { href: '#about', label: '工作经历' },
];
---

<nav id="navbar" class="fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50 border-b border-slate-200 dark:border-slate-700 transition-all duration-300">
  <div class="container mx-auto px-6 py-4 flex justify-between items-center">
    <a href="/" class="font-bold text-lg text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">江斌</a>

    <!-- 桌面端导航 -->
    <div class="hidden md:flex gap-6 items-center">
      {navItems.map((item) => (
        <a href={item.href}
           class="nav-link text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors relative py-1"
           data-section={item.href.replace('#', '')}>
          {item.label}
          <span class="nav-indicator absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300"></span>
        </a>
      ))}
      <a href="https://github.com/jiangbingo" target="_blank"
         class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
        GitHub
      </a>
      <Search />
      <ThemeToggle />
    </div>

    <!-- 移动端菜单按钮 -->
    <button id="mobile-menu-btn" class="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path class="menu-icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        <path class="close-icon hidden" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
  </div>

  <!-- 移动端菜单 -->
  <div id="mobile-menu" class="md:hidden hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
    <div class="container mx-auto px-6 py-4 flex flex-col gap-4">
      {navItems.map((item) => (
        <a href={item.href}
           class="nav-link text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors py-2"
           data-section={item.href.replace('#', '')}>
          {item.label}
        </a>
      ))}
      <a href="https://github.com/jiangbingo" target="_blank"
         class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors py-2">
        GitHub
      </a>
      <div class="flex gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
        <Search />
        <ThemeToggle />
      </div>
    </div>
  </div>
</nav>

<script>
  // 移动端菜单切换
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = menuBtn?.querySelector('.menu-icon');
  const closeIcon = menuBtn?.querySelector('.close-icon');

  menuBtn?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('hidden');
    menuIcon?.classList.toggle('hidden');
    closeIcon?.classList.toggle('hidden');
  });

  // 点击导航链接后关闭移动端菜单
  mobileMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuIcon?.classList.remove('hidden');
      closeIcon?.classList.add('hidden');
    });
  });

  // 滚动时高亮当前区块
  const sections = ['hero', 'skills', 'projects', 'about'];
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          navLinks.forEach((link) => {
            const linkSection = (link as HTMLAnchorElement).dataset.section;
            const indicator = link.querySelector('.nav-indicator');

            if (linkSection === sectionId) {
              link.classList.add('text-indigo-600', 'dark:text-indigo-400');
              link.classList.remove('text-slate-600', 'dark:text-slate-400');
              indicator?.classList.add('w-full');
            } else {
              link.classList.remove('text-indigo-600', 'dark:text-indigo-400');
              link.classList.add('text-slate-600', 'dark:text-slate-400');
              indicator?.classList.remove('w-full');
            }
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) observer.observe(section);
  });

  // 滚动时导航栏样式变化
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const currentScroll = window.scrollY;

    if (currentScroll > 100) {
      navbar?.classList.add('shadow-md');
    } else {
      navbar?.classList.remove('shadow-md');
    }

    lastScroll = currentScroll;
  });
</script>
```

**Step 2: 提交**

```bash
git add src/components/Navbar.astro
git commit -m "feat: 创建独立导航组件，支持滚动高亮和移动端菜单"
```

---

### Task 10: 更新 Base 布局使用新导航

**Files:**
- Modify: `src/layouts/Base.astro`

**Step 1: 替换导航**

```astro
---
import Navbar from '../components/Navbar.astro';
import Analytics from '@vercel/analytics/astro';

// ... 其余保持不变
---

<!doctype html>
<!-- head 部分保持不变 -->
<body class="min-h-screen">
  <Navbar />
  <main class="pt-16">
    <slot />
  </main>
  <Analytics />
</body>
```

**Step 2: 为各区块添加 id**

修改 `src/components/Hero.astro`，在 section 添加 id：

```astro
<section id="hero" class="relative min-h-screen flex items-center justify-center overflow-hidden">
```

**Step 3: 验证效果**

Run: 刷新页面
Expected: 导航高亮随滚动变化，移动端有汉堡菜单

**Step 4: 提交**

```bash
git add src/layouts/Base.astro src/components/Hero.astro
git commit -m "refactor: 使用独立导航组件替换内联导航"
```

---

## 阶段三：功能增强（P2）

### Task 11: 创建技能数据文件

**Files:**
- Create: `src/data/skills.ts`

**Step 1: 创建数据文件**

```typescript
// src/data/skills.ts

export interface Skill {
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
}

export interface SkillGroup {
  icon: string;
  title: string;
  skills: Skill[];
}

export const skillGroups: SkillGroup[] = [
  {
    icon: '🤖',
    title: 'AI 应用工程',
    skills: [
      { name: 'RAG 检索增强', level: 5 },
      { name: 'Prompt Engineering', level: 5 },
      { name: 'Agent RAG', level: 4 },
      { name: 'Text-to-SQL', level: 4 },
      { name: 'LLM Function Calling', level: 4 },
    ],
  },
  {
    icon: '⚙️',
    title: 'Python 后端',
    skills: [
      { name: 'FastAPI', level: 5 },
      { name: 'Django', level: 4 },
      { name: 'Pydantic 2.9+', level: 5 },
      { name: '异步架构', level: 4 },
      { name: 'Celery', level: 4 },
      { name: '消息队列', level: 3 },
    ],
  },
  {
    icon: '☁️',
    title: '云原生 & ML 部署',
    skills: [
      { name: 'Azure Functions', level: 4 },
      { name: 'Serverless', level: 4 },
      { name: 'ML Endpoint', level: 4 },
      { name: 'Docker', level: 4 },
      { name: 'GitHub Actions', level: 5 },
    ],
  },
  {
    icon: '🧠',
    title: '深度学习',
    skills: [
      { name: 'PyTorch 2.2+', level: 4 },
      { name: 'TensorFlow 2.19', level: 3 },
      { name: 'YOLOv8', level: 4 },
      { name: 'ONNX Runtime', level: 4 },
      { name: 'Keras', level: 3 },
    ],
  },
  {
    icon: '📊',
    title: '数据 & 数据库',
    skills: [
      { name: 'PostgreSQL', level: 5 },
      { name: 'Milvus', level: 4 },
      { name: 'MariaDB', level: 4 },
      { name: 'Pandas', level: 5 },
      { name: 'NumPy', level: 5 },
      { name: 'UMAP', level: 3 },
    ],
  },
  {
    icon: '💻',
    title: '全栈工程背景',
    skills: [
      { name: '嵌入式开发', level: 4 },
      { name: 'C/汇编', level: 3 },
      { name: 'pytest', level: 5 },
      { name: 'RobotFramework', level: 5 },
      { name: '跨领域融合', level: 5 },
    ],
  },
];

export const levelLabels: Record<number, string> = {
  1: '了解',
  2: '掌握',
  3: '熟练',
  4: '专家',
  5: '精通',
};
```

**Step 2: 提交**

```bash
git add src/data/skills.ts
git commit -m "feat: 创建技能数据文件，添加熟练度等级"
```

---

### Task 12: 更新 SkillCard 显示等级

**Files:**
- Modify: `src/components/SkillCard.astro`
- Modify: `src/components/Skills.astro`

**Step 1: 更新 SkillCard 组件**

```astro
---
// src/components/SkillCard.astro
interface Props {
  icon: string;
  title: string;
  skills: { name: string; level: number }[];
}

const { icon, title, skills } = Astro.props;

const levelLabels: Record<number, string> = {
  1: '了解',
  2: '掌握',
  3: '熟练',
  4: '专家',
  5: '精通',
};
---

<div class="group bg-white dark:bg-slate-700 rounded-xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-indigo-400 dark:hover:border-indigo-500 cursor-default">
  <div class="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
  <h3 class="text-lg font-semibold mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{title}</h3>
  <div class="space-y-2">
    {skills.map((skill) => (
      <div class="flex items-center justify-between">
        <span class="text-sm text-slate-600 dark:text-slate-300">{skill.name}</span>
        <div class="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <span class={`w-2 h-2 rounded-full ${i <= skill.level ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
          ))}
        </div>
      </div>
    ))}
  </div>
</div>
```

**Step 2: 更新 Skills 组件使用数据文件**

```astro
---
// src/components/Skills.astro
import SkillCard from './SkillCard.astro';
import { skillGroups } from '../data/skills';
---

<section id="skills" class="py-20 bg-slate-100 dark:bg-slate-800">
  <!-- ... 其余保持不变，skillGroups 改为从文件导入 -->
</section>
```

**Step 3: 验证效果**

Run: 刷新页面
Expected: 技能卡片显示每个技能的等级点

**Step 4: 提交**

```bash
git add src/components/SkillCard.astro src/components/Skills.astro
git commit -m "feat: 技能卡片显示熟练度等级"
```

---

### Task 13: 创建项目详情弹窗组件

**Files:**
- Create: `src/components/ProjectModal.astro`
- Create: `src/data/projects.ts`

**Step 1: 创建项目数据文件**

```typescript
// src/data/projects.ts

export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  tech: string[];
  metrics: { label: string; value: string }[];
  highlights?: string[];
  links?: {
    github?: string;
    demo?: string;
    docs?: string;
  };
}

export const projects: Project[] = [
  {
    id: 'defect-detection',
    title: '缺陷检测大模型应用平台',
    description: '融合 YOLOv8 专用视觉模型与通用 LLM 的工业缺陷检测系统，支持在线识别与判定',
    fullDescription: '融合 YOLOv8 专用视觉模型与通用 LLM 的工业缺陷检测系统，支持在线识别与判定。实现了从图像采集、预处理、模型推理到结果输出的完整流水线。系统能够自动识别工业产品的各类缺陷，并通过 LLM 生成缺陷分析报告。',
    tech: ['PyTorch', 'ONNX', 'FastAPI', 'RabbitMQ', 'Azure'],
    metrics: [
      { label: '技术栈', value: 'YOLOv8+LLM' },
      { label: '部署', value: 'Azure ML' },
    ],
    highlights: [
      '模型量化部署，推理速度提升 3x',
      '支持 GPU/CPU 混合推理',
      'RESTful API + WebSocket 实时推送',
    ],
    links: {
      github: 'https://github.com/jiangbingo',
    },
  },
  {
    id: 'rag-qa-system',
    title: 'RAG 智能问答系统',
    description: '企业知识库 + Text-to-SQL + Agent RAG 实现，集成 Vanna.ai 智能查询',
    fullDescription: '基于 RAG 架构的企业级智能问答系统，支持知识库检索、自然语言转 SQL 查询、Agent 多轮对话等功能。集成 Vanna.ai 实现智能 SQL 生成，大幅提升数据查询效率。',
    tech: ['RAG', 'Milvus', 'PostgreSQL', 'FastAPI', 'SQLAlchemy'],
    metrics: [
      { label: '状态', value: '已上线' },
      { label: '架构', value: '全栈负责' },
    ],
    highlights: [
      '向量检索 + 关键词检索混合召回',
      'Text-to-SQL 准确率达 90%+',
      '支持多轮对话上下文理解',
    ],
    links: {
      github: 'https://github.com/jiangbingo',
    },
  },
  {
    id: 'quality-analysis',
    title: '质量分析平台 (piyi-api)',
    description: '基于 TensorFlow + Keras 的质量分析模型，实现 UMAP 降维 + HDBSCAN 聚类',
    fullDescription: '基于 TensorFlow + Keras 的质量分析模型，实现 UMAP 降维 + HDBSCAN 聚类。用于工业产品的质量数据分析和异常检测，支持大规模数据的高效处理。',
    tech: ['TensorFlow', 'Keras', 'UMAP', 'HDBSCAN', 'scikit-learn'],
    metrics: [
      { label: '部署', value: '混合部署' },
      { label: '功能', value: '降维可视化' },
    ],
    highlights: [
      'UMAP 降维保持数据局部和全局结构',
      'HDBSCAN 自动确定聚类数量',
      '交互式可视化大屏',
    ],
  },
  {
    id: 'ai-inference-engine',
    title: 'AI 推理引擎 (AI-Project)',
    description: '可独立安装的 Python 包，支持 YOLOv8 目标检测与 GPU 加速推理',
    fullDescription: '可独立安装的 Python 包，支持 YOLOv8 目标检测与 GPU 加速推理。提供统一的推理接口，支持多种模型格式，方便集成到各类应用中。',
    tech: ['PyTorch', 'ONNX', 'OpenCV', 'GitHub Actions'],
    metrics: [
      { label: '安装', value: 'pip' },
      { label: 'CI/CD', value: '自动化' },
    ],
    highlights: [
      '支持 pip 一键安装',
      'GPU/CPU 自动切换',
      'GitHub Actions 自动化发布',
    ],
    links: {
      github: 'https://github.com/jiangbingo',
    },
  },
];
```

**Step 2: 创建弹窗组件**

```astro
---
// src/components/ProjectModal.astro
---

<div id="project-modal" class="fixed inset-0 z-[100] hidden items-center justify-center p-4">
  <div id="modal-backdrop" class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
  <div class="relative z-10 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
    <!-- 关闭按钮 -->
    <button id="modal-close" class="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- 内容区域 -->
    <div class="p-6 md:p-8">
      <!-- 顶部渐变 -->
      <div class="h-32 -mx-6 md:-mx-8 -mt-6 md:-mt-8 mb-6 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 rounded-t-2xl"></div>

      <!-- 标题 -->
      <h2 id="modal-title" class="text-2xl font-bold mb-4"></h2>

      <!-- 描述 -->
      <p id="modal-description" class="text-slate-600 dark:text-slate-400 mb-6"></p>

      <!-- 技术栈 -->
      <div class="mb-6">
        <h3 class="font-semibold mb-2">技术栈</h3>
        <div id="modal-tech" class="flex flex-wrap gap-2"></div>
      </div>

      <!-- 核心亮点 -->
      <div id="modal-highlights-container" class="mb-6 hidden">
        <h3 class="font-semibold mb-2">核心亮点</h3>
        <ul id="modal-highlights" class="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1"></ul>
      </div>

      <!-- 链接 -->
      <div id="modal-links" class="flex gap-4"></div>
    </div>
  </div>
</div>

<script>
  import { projects } from '../data/projects';

  const modal = document.getElementById('project-modal');
  const backdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('modal-close');

  function openModal(projectId: string) {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    (document.getElementById('modal-title') as HTMLElement).textContent = project.title;
    (document.getElementById('modal-description') as HTMLElement).textContent = project.fullDescription;

    // 技术栈
    const techContainer = document.getElementById('modal-tech');
    if (techContainer) {
      techContainer.innerHTML = project.tech
        .map((t) => `<span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm">${t}</span>`)
        .join('');
    }

    // 亮点
    const highlightsContainer = document.getElementById('modal-highlights-container');
    const highlightsList = document.getElementById('modal-highlights');
    if (project.highlights && highlightsContainer && highlightsList) {
      highlightsContainer.classList.remove('hidden');
      highlightsList.innerHTML = project.highlights.map((h) => `<li>${h}</li>`).join('');
    }

    // 链接
    const linksContainer = document.getElementById('modal-links');
    if (linksContainer && project.links) {
      const links = [];
      if (project.links.github) {
        links.push(`<a href="${project.links.github}" target="_blank" class="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition">GitHub</a>`);
      }
      if (project.links.demo) {
        links.push(`<a href="${project.links.demo}" target="_blank" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">在线演示</a>`);
      }
      linksContainer.innerHTML = links.join('');
    }

    modal?.classList.remove('hidden');
    modal?.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal?.classList.add('hidden');
    modal?.classList.remove('flex');
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);

  // ESC 关闭
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // 暴露全局函数
  (window as any).openProjectModal = openModal;
</script>
```

**Step 3: 提交**

```bash
git add src/data/projects.ts src/components/ProjectModal.astro
git commit -m "feat: 创建项目详情弹窗组件"
```

---

### Task 14: 项目卡片点击打开弹窗

**Files:**
- Modify: `src/components/ProjectCard.astro`
- Modify: `src/components/Projects.astro`
- Modify: `src/layouts/Base.astro`

**Step 1: 更新 ProjectCard 添加点击事件**

```astro
---
// src/components/ProjectCard.astro
interface Props {
  id: string;
  title: string;
  description: string;
  tech: string[];
  metrics: { label: string; value: string }[];
}

const { id, title, description, tech, metrics } = Astro.props;
---

<div class="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer hover:-translate-y-1"
     onclick={`openProjectModal('${id}')`">
  <!-- ... 其余保持不变 -->
</div>
```

**Step 2: 在 Base 布局引入弹窗组件**

```astro
---
import Navbar from '../components/Navbar.astro';
import ProjectModal from '../components/ProjectModal.astro';
import Analytics from '@vercel/analytics/astro';
---

<body class="min-h-screen">
  <Navbar />
  <main class="pt-16">
    <slot />
  </main>
  <ProjectModal />
  <Analytics />
</body>
```

**Step 3: 更新 Projects 组件使用数据文件**

```astro
---
// src/components/Projects.astro
import ProjectCard from './ProjectCard.astro';
import { projects } from '../data/projects';
---

<!-- 使用 projects 数据，每个项目传入 id -->
```

**Step 4: 验证效果**

Run: 刷新页面，点击项目卡片
Expected: 弹窗显示项目详情

**Step 5: 提交**

```bash
git add src/components/ProjectCard.astro src/components/Projects.astro src/layouts/Base.astro
git commit -m "feat: 项目卡片点击打开详情弹窗"
```

---

## 验收清单

完成后验证以下功能：

- [ ] Hero 头像有光晕呼吸动画
- [ ] 姓名逐字渐入
- [ ] 职位打字机效果循环
- [ ] 按钮悬停上浮 + 阴影
- [ ] 技能卡片悬停动效
- [ ] 项目卡片悬停动效
- [ ] 卡片滚动渐入动画
- [ ] 导航滚动高亮
- [ ] 移动端汉堡菜单
- [ ] 技能等级点显示
- [ ] 项目详情弹窗
- [ ] 暗色模式正常
- [ ] 移动端布局正常
