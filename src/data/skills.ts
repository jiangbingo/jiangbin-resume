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
