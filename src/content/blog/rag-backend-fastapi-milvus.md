---
title: "创建索引"
description: "结合企业知识库项目经验，分享如何使用 FastAPI 与 Milvus 搭建 RAG 智能问答后端的完整实践。"
date: 2024-11-27
tags: [RAG, FastAPI, Milvus, AI, Python]
publish: true
author: Jiang Bin
---

## 背景与目标

企业内部有大量 PDF / Word / 表格协议或业务文档，人工查找成本高。希望通过知识库问答系统，让业务/测试/一线工程师可以自然语言提问。回答要"可追溯"，能回溯到原始文档片段，而不是纯生成。

## 整体架构设计

```
┌─────────────────────────────────────────────────────────┐
│                      用户提问                           │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  FastAPI 服务层                                         │
│  - 认证鉴权  - 限流控制  - 日志记录                      │
└─────────────────────────────────────────────────────────┘
                        ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   文档解析    │  │  向量检索    │  │  LLM 生成    │
│   层         │→ │  层         │→ │  层          │
└──────────────┘  └──────────────┘  └──────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                    Milvus 向量库                        │
└─────────────────────────────────────────────────────────┘
```

### 核心模块说明

| 模块 | 职责 | 技术选型 |
|------|------|----------|
| 文档解析层 | 格式转换、文本抽取与分段 | PyPDF, python-docx |
| 向量化与入库 | 段落向量化，写入向量数据库 | Milvus, text-embedding |
| 检索与重排 | 召回候选片段，过滤/重排 | BM25 + 语义检索 |
| 生成层 | 拼接 Prompt，大模型生成 | OpenAI API / 本地模型 |
| 服务层 | HTTP 接口，认证限流日志 | FastAPI, Pydantic |

## FastAPI 服务设计

### 请求响应模型

```python
from pydantic import BaseModel
from typing import List, Optional

class QueryRequest(BaseModel):
    question: str
    top_k: int = 5
    collection: Optional[str] = None

class Source(BaseModel):
    content: str
    source: str
    score: float

class QueryResponse(BaseModel):
    answer: str
    sources: List[Source]
    latency_ms: float
```

### 核心接口实现

```python
from fastapi import FastAPI, HTTPException
import time

app = FastAPI(title="RAG Q&A API")

@app.post("/api/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    start = time.time()

    # 1. 向量检索
    docs = await retriever.search(
        query=request.question,
        top_k=request.top_k
    )

    # 2. 构建 Prompt
    context = "\n".join([d.content for d in docs])
    prompt = f"基于以下内容回答问题：\n{context}\n\n问题：{request.question}"

    # 3. LLM 生成
    answer = await llm.generate(prompt)

    latency = (time.time() - start) * 1000

    return QueryResponse(
        answer=answer,
        sources=[Source(**d) for d in docs],
        latency_ms=latency
    )
```

## Milvus 库表设计

### Collection 设计

```python
from pymilvus import Collection, FieldSchema, CollectionSchema, DataType

fields = [
    FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
    FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=1536),
    FieldSchema(name="content", dtype=DataType.VARCHAR, max_length=2000),
    FieldSchema(name="source", dtype=DataType.VARCHAR, max_length=500),
    FieldSchema(name="page", dtype=DataType.INT64),
]

schema = CollectionSchema(fields, description="企业知识库")
collection = Collection("knowledge_base", schema)

# 创建索引
index_params = {
    "metric_type": "COSINE",
    "index_type": "IVF_FLAT",
    "params": {"nlist": 1024}
}
collection.create_index("embedding", index_params)
```

### 元数据设计要点

| 字段 | 用途 | 示例 |
|------|------|------|
| source | 文档来源 | `docs/manual.pdf` |
| page | 页码 | `42` |
| chunk_id | 片段序号 | `3` |
| doc_type | 文档类型 | `manual`, `contract` |

## 工程化实践

### 1. 超时与熔断

```python
from circuitbreaker import circuit

@circuit(failure_threshold=5, recovery_timeout=60)
async def call_llm(prompt: str) -> str:
    async with timeout(30):
        return await llm_client.generate(prompt)
```

### 2. 日志记录

```python
import structlog

logger = structlog.get_logger()

@app.post("/api/query")
async def query(request: QueryRequest):
    logger.info("query_received", question=request.question)

    # ... 处理逻辑 ...

    logger.info("query_completed",
                answer_length=len(answer),
                latency_ms=latency)
```

### 3. Docker 部署

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 性能指标

| 指标 | 目标值 | 实测值 |
|------|--------|--------|
| 向量检索延迟 | < 100ms | 85ms |
| LLM 生成延迟 | < 2s | 1.8s |
| 端到端延迟 | < 3s | 2.5s |
| 并发支持 | 100 QPS | 120 QPS |

## 总结

> RAG 系统的核心不是模型，而是架构设计。好的架构能让普通模型也能发挥出色效果。

### 关键收获

1. **分层设计** - 检索和生成解耦，便于独立优化
2. **元数据丰富** - 好的元数据让检索结果更精准
3. **工程化优先** - 超时、熔断、日志是生产必备

## 参考资料

- [Milvus 官方文档](https://milvus.io/docs)
- [FastAPI 官方教程](https://fastapi.tiangolo.com)
- [Advanced RAG Notes](https://www.aneasystone.com/archives/2024/06/advanced-rag-notes.html)
