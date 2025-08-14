# Health360 System Architecture

## Overview

Health360 is an AI-powered personalized health platform that combines customer health data with Retrieval-Augmented Generation (RAG) to provide tailored health insights and recommendations. The system leverages OpenAI's GPT-4o-mini for intelligent analysis while maintaining a robust fallback system for reliability.

## High-Level Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React TypeScript UI]
        Dashboard[Health Dashboard]
        Chat[AI Chat Interface]
        Upload[Lab Upload]
    end
    
    subgraph "Data Sources"
        UserProfile[User Profile Data]
        LabResults[Lab Results]
        ChatHistory[Chat History]
        Products[Product Catalog]
    end
    
    subgraph "RAG System"
        DataAgg[Data Aggregation Layer]
        ContextBuilder[Context Builder]
        AIProcessor[OpenAI GPT-4o-mini]
        Fallback[Rule-based Fallback]
    end
    
    subgraph "External Services"
        OpenAI[OpenAI API]
        Pharmacy[Apteekki360.fi]
    end
    
    UI --> DataAgg
    Dashboard --> DataAgg
    Chat --> DataAgg
    Upload --> DataAgg
    
    UserProfile --> ContextBuilder
    LabResults --> ContextBuilder
    ChatHistory --> ContextBuilder
    Products --> ContextBuilder
    
    DataAgg --> ContextBuilder
    ContextBuilder --> AIProcessor
    AIProcessor --> OpenAI
    AIProcessor --> Fallback
    
    AIProcessor --> UI
    Fallback --> UI
    
    Products --> Pharmacy
```

## Personalization Flow with RAG

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant ContextBuilder
    participant RAG as RAG Engine
    participant OpenAI
    participant Fallback
    participant DataStore
    
    User->>Frontend: Asks health question
    Frontend->>ContextBuilder: User query + request context
    
    ContextBuilder->>DataStore: Retrieve user profile
    ContextBuilder->>DataStore: Retrieve lab results
    ContextBuilder->>DataStore: Retrieve chat history
    
    ContextBuilder->>RAG: Build personalized context
    
    Note over RAG: Combine user data:<br/>- Demographics (age, health goals)<br/>- Lab values & trends<br/>- Previous interactions<br/>- Health status patterns
    
    RAG->>OpenAI: Enhanced prompt with context
    
    alt OpenAI Success
        OpenAI->>RAG: Personalized AI response
        RAG->>Frontend: Tailored health advice
    else OpenAI Failure
        RAG->>Fallback: Context + user data
        Fallback->>RAG: Rule-based personalized response
        RAG->>Frontend: Fallback health advice
    end
    
    Frontend->>User: Personalized recommendations
    Frontend->>DataStore: Store interaction for future context
```

## Data Integration Architecture

```mermaid
graph LR
    subgraph "User Data Sources"
        A[User Registration<br/>Age, Goals, Preferences]
        B[Lab Results<br/>Testosterone, Cholesterol<br/>Vitamin Levels]
        C[Chat Interactions<br/>Symptoms, Concerns<br/>Response History]
        D[Health Assessments<br/>Energy, Sleep<br/>Lifestyle Factors]
    end
    
    subgraph "Context Builder"
        E[Data Aggregation]
        F[Health Profile Builder]
        G[Temporal Analysis]
        H[Risk Assessment]
    end
    
    subgraph "RAG Processing"
        I[Context Enrichment]
        J[Prompt Engineering]
        K[AI Response Generation]
        L[Response Validation]
    end
    
    A --> E
    B --> E
    C --> E
    D --> E
    
    E --> F
    E --> G
    E --> H
    
    F --> I
    G --> I
    H --> I
    
    I --> J
    J --> K
    K --> L
    
    L --> M[Personalized Output]
```

## RAG Context Building Process

```mermaid
flowchart TD
    Start([User Query Received]) --> Collect[Collect User Context]
    
    Collect --> Profile[Build User Profile Summary]
    Collect --> Labs[Analyze Lab Results]
    Collect --> History[Review Chat History]
    
    Profile --> |Demographics & Goals| Context[Context Synthesis]
    Labs --> |Health Metrics & Trends| Context
    History --> |Previous Interactions| Context
    
    Context --> Prompt[Generate Enhanced Prompt]
    
    Prompt --> OpenAI{OpenAI Available?}
    
    OpenAI -->|Yes| AI[AI Processing with<br/>Full Context]
    OpenAI -->|No| Rules[Rule-based Processing<br/>with Context]
    
    AI --> Validate[Validate Response]
    Rules --> Validate
    
    Validate --> Output[Personalized Health<br/>Recommendations]
    
    Output --> Store[Store Interaction<br/>for Future Context]
    
    subgraph "Context Elements"
        CE1[User Age & Demographics]
        CE2[Health Goals & Concerns]
        CE3[Lab Result Trends]
        CE4[Abnormal Values]
        CE5[Previous Q&A Patterns]
        CE6[Risk Factors]
    end
    
    Context -.-> CE1
    Context -.-> CE2
    Context -.-> CE3
    Context -.-> CE4
    Context -.-> CE5
    Context -.-> CE6
```

## Lab Results Processing Pipeline

```mermaid
graph TD
    subgraph "Input Sources"
        Manual[Manual Entry<br/>Form Input]
        Upload[PDF Upload<br/>OCR Processing]
    end
    
    subgraph "Processing Layer"
        Validation[Data Validation]
        Normalization[Value Normalization]
        Classification[Status Classification<br/>Normal/Low/High/Critical]
        Trend[Trend Analysis]
    end
    
    subgraph "Context Integration"
        Historical[Historical Comparison]
        Risk[Risk Assessment]
        Recommendations[Recommendation Engine]
    end
    
    subgraph "AI Enhancement"
        ContextPrompt[Context-Rich Prompting]
        PersonalizedAI[Personalized AI Analysis]
        ActionableInsights[Actionable Insights]
    end
    
    Manual --> Validation
    Upload --> Validation
    
    Validation --> Normalization
    Normalization --> Classification
    Classification --> Trend
    
    Trend --> Historical
    Historical --> Risk
    Risk --> Recommendations
    
    Recommendations --> ContextPrompt
    ContextPrompt --> PersonalizedAI
    PersonalizedAI --> ActionableInsights
    
    ActionableInsights --> Dashboard[Health Dashboard Display]
    ActionableInsights --> Chat[AI Chat Integration]
```

## Product Recommendation RAG Flow

```mermaid
sequenceDiagram
    participant User
    participant RAG as RAG System
    participant HealthData as Health Data Store
    participant ProductDB as Product Database
    participant AI as OpenAI GPT-4o-mini
    participant Pharmacy as Apteekki360.fi
    
    User->>RAG: Request product recommendations
    
    RAG->>HealthData: Retrieve user health profile
    Note over HealthData: Lab results, symptoms,<br/>health goals, preferences
    
    RAG->>ProductDB: Get available products
    Note over ProductDB: 27+ Finnish pharmacy products<br/>with pricing and specifications
    
    RAG->>AI: Enhanced prompt with:<br/>- User health context<br/>- Symptom analysis<br/>- Product specifications<br/>- Compatibility matrix
    
    AI->>RAG: Personalized product recommendations<br/>with confidence scores & explanations
    
    RAG->>User: Top 3-4 products with:<br/>- Relevance reasoning<br/>- Expected benefits<br/>- Usage instructions<br/>- Member pricing
    
    User->>Pharmacy: Direct purchase links
```

## AI Chat System Architecture

```mermaid
graph TB
    subgraph "Chat Interface"
        ChatUI[Chat UI Component]
        MessageFlow[Message Flow Handler]
        TypingIndicator[Typing Indicator]
    end
    
    subgraph "Context Management"
        SessionContext[Session Context]
        UserProfile[User Profile Cache]
        LabContext[Lab Results Context]
        HistoryBuffer[Chat History Buffer]
    end
    
    subgraph "AI Processing Pipeline"
        PromptBuilder[Prompt Builder]
        ContextEnrichment[Context Enrichment]
        OpenAIClient[OpenAI Client]
        ResponseProcessor[Response Processor]
        FallbackEngine[Fallback Engine]
    end
    
    subgraph "Knowledge Base"
        HealthKnowledge[Health Knowledge Base]
        ProductCatalog[Product Information]
        UserData[Historical User Data]
        MedicalGuidelines[Medical Guidelines]
    end
    
    ChatUI --> MessageFlow
    MessageFlow --> SessionContext
    
    SessionContext --> UserProfile
    SessionContext --> LabContext
    SessionContext --> HistoryBuffer
    
    UserProfile --> PromptBuilder
    LabContext --> PromptBuilder
    HistoryBuffer --> PromptBuilder
    
    PromptBuilder --> ContextEnrichment
    ContextEnrichment --> OpenAIClient
    
    OpenAIClient --> ResponseProcessor
    ResponseProcessor --> FallbackEngine
    
    HealthKnowledge --> ContextEnrichment
    ProductCatalog --> ContextEnrichment
    UserData --> ContextEnrichment
    MedicalGuidelines --> ContextEnrichment
    
    ResponseProcessor --> MessageFlow
    FallbackEngine --> MessageFlow
```

## Key Features of the RAG Implementation

### 1. Multi-Source Data Integration
- **User Demographics**: Age, health goals, lifestyle preferences
- **Lab Results**: Testosterone levels, cholesterol, vitamin D, etc.
- **Interaction History**: Previous questions, concerns, and responses
- **Health Assessments**: Energy levels, sleep quality, stress indicators

### 2. Context-Aware Prompt Engineering
```typescript
// Example context building from the codebase
const buildHealthContext = (user: User, labResults: LabEntry[], chatHistory: ChatMessage[]) => {
  const labSummary = buildLabSummary(labResults);
  const conversationHistory = chatHistory.slice(-6);
  
  return `
    User Context:
    - Age: ${user.age}
    - Health Goals: ${user.healthGoals}
    - Recent Lab Results: ${labSummary}
    - Conversation History: ${conversationHistory}
  `;
};
```

### 3. Intelligent Fallback System
- Rule-based responses when OpenAI is unavailable
- Context-aware fallback using user data
- Maintains personalization even without AI

### 4. Continuous Learning Loop
- User interactions are stored for future context
- Response effectiveness tracking
- Personalization improves over time

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **React Router** for navigation

### AI & RAG
- **OpenAI GPT-4o-mini** for natural language processing
- **Custom context builders** for health data integration
- **Rule-based fallback system** for reliability
- **Prompt engineering** for medical accuracy

### Data Management
- **Local Storage** for demo (production would use secure backend)
- **User Data Service** for centralized data access
- **Chat History Management** for context persistence

### External Integrations
- **Apteekki360.fi** for authentic Finnish pharmacy products
- **OpenAI API** for AI-powered responses
- **PDF Processing** for lab result uploads

## Security and Privacy Considerations

```mermaid
graph LR
    subgraph "Data Protection"
        A[Data Encryption]
        B[User Consent]
        C[GDPR Compliance]
    end
    
    subgraph "AI Safety"
        D[Response Validation]
        E[Medical Disclaimers]
        F[Fallback Systems]
    end
    
    subgraph "Access Control"
        G[User Authentication]
        H[Tier-based Access]
        I[Session Management]
    end
    
    A --> UserData[User Health Data]
    B --> UserData
    C --> UserData
    
    D --> AIResponse[AI Responses]
    E --> AIResponse
    F --> AIResponse
    
    G --> Platform[Platform Access]
    H --> Platform
    I --> Platform
```

## Scalability and Performance

The architecture is designed for scalability with:

- **Modular Component Design**: Easy to extend and maintain
- **Efficient Context Management**: Only relevant data included in prompts
- **Caching Strategies**: User profiles and frequent queries cached
- **Fallback Reliability**: System functions even when external APIs fail
- **Progressive Enhancement**: Features degrade gracefully based on user tier

## Future Enhancements

1. **Advanced RAG Features**
   - Vector embeddings for semantic search
   - Knowledge graph integration
   - Multi-modal AI (text + image analysis)

2. **Enhanced Personalization**
   - Machine learning models for user behavior prediction
   - A/B testing for recommendation optimization
   - Advanced health risk modeling

3. **Extended Data Sources**
   - Wearable device integration
   - Electronic health records (EHR) connectivity
   - Real-time health monitoring

This architecture enables Health360 to provide highly personalized health recommendations by intelligently combining user-specific data with advanced AI capabilities, ensuring both accuracy and reliability in health guidance.
