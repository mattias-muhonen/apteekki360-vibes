# Health360 Project Scope - Quick Reference

## Project Overview
**Health360** is an AI-powered men's health platform that provides personalized health assessments and product recommendations from Finnish pharmacy Apteekki360.fi.

## Core Purpose
Transform generic health advice into personalized recommendations by combining:
- User health data (lab results, symptoms, demographics)
- AI analysis (OpenAI GPT-4o-mini)
- Real Finnish pharmacy products
- RAG (Retrieval-Augmented Generation) for context-aware responses

## Key Features & Functionality

### 1. AI Health Assessment System
- Interactive chat for symptom analysis
- Two health flows: Fatigue/Energy and Low Testosterone
- 5-question optimization for quick results
- Real-time conversation with context awareness

### 2. Personalized Product Recommendations
- 27+ authentic Finnish pharmacy products with Euro pricing
- AI-powered product matching based on user health profile
- Confidence scoring and detailed explanations
- Direct integration with Apteekki360.fi

### 3. Health Dashboard & Tracking
- KPI monitoring (Testosterone, Energy, Sleep scores)
- Lab results management (manual entry + PDF upload)
- Progress tracking with visual charts
- Personalized health plans with milestones

### 4. User Management
- Three-tier system: Visitor, Registered, Member
- Email verification with OTP
- Member benefits (15-25% savings, priority features)
- Secure data handling with local storage (demo)

## Technical Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **AI**: OpenAI GPT-4o-mini with custom health prompts
- **Data**: Local storage (demo), UserDataService for state management
- **External**: Apteekki360.fi integration for real products

## Current State (August 2025)
- ✅ Complete AI chat system with health flows
- ✅ Product recommendation engine
- ✅ Health dashboard with progress tracking
- ✅ Lab results management system
- ✅ User authentication and tier system
- ✅ "My Plan" page with today's tasks (exercise, nutrition, vitamins)
- ✅ Enhanced plan progress tracking (starting point → current → goal)

## Key Pages & Components
1. **Homepage**: Symptom chips, health assessment entry
2. **Chat**: AI-powered health consultation
3. **Dashboard** ("My Dashboard"): Health metrics, lab results, AI chat
4. **Plan** ("My Plan"): Active health plans, daily tasks, progress tracking
5. **Lab Upload**: Manual entry + PDF processing
6. **Product Catalog**: Browsing and purchasing
7. **Test Booking**: Appointment scheduling with add-ons

## Business Model
- Finnish pharmacy product sales through Apteekki360.fi
- Member subscriptions for premium features
- Lab test booking commissions
- Personalized health consultation services

## Target Users
- Men aged 25-55 concerned about:
  - Low energy/fatigue
  - Testosterone levels
  - General health optimization
  - Preventive healthcare

## Unique Value Proposition
- **Personalized AI**: Not generic health advice, but recommendations based on actual user data
- **Real Products**: Authentic Finnish pharmacy integration with real pricing
- **Comprehensive Tracking**: From assessment to purchase to progress monitoring
- **Professional Integration**: Lab booking and healthcare provider connections

## Development Guidelines
- Always consider user health data context when building features
- Maintain fallback systems for AI reliability
- Ensure member tier benefits are clearly communicated
- Keep medical disclaimers and safety considerations
- Focus on actionable, personalized recommendations over generic advice

## Quick Decision Framework
When building new features, ask:
1. Does this enhance personalization using user health data?
2. Does this integrate with the existing health flow (assessment → recommendations → tracking)?
3. Does this provide clear value for the member tier system?
4. Does this maintain medical safety and appropriate disclaimers?
5. Does this support the Finnish pharmacy business model?

---
*This document serves as a quick reference for understanding Health360's scope and making informed development decisions.*
