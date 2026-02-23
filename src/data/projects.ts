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
