# TruePic

**Spot the Fake. Know What's Real**.
AI Image Detection at your Fingertips.

## Table of Contents
- Overview
- Features
- Demo
- Architecture
- How It Works
- Tech Stack
- Setup Instructions
- Project Structure
- Contributing
- License

## Overview

**TruePic** is a web application that helps users distinguish between AI-generated images and authentic human-generated images.

You simply upload an image — **TruePic** delivers instant predictions using a fine-tuned AI model trained to detect subtle cues in synthetic media.

This project aims to promote transparency in online visual conent and help combat misinformation and deepfakes.

## Features

✅ Upload images via drag & drop
✅ AI-powered image authenticity detection
✅ Clean and intuitive web interface
✅ Real-time inference powered by backend ML model
✅ Dynamic result display with confidence visualization
✅ User authentication (via Firebase)

## ML Model Architecture

Details on fine-tuning can be found [here](https://github.com/jh000107/AI-Image-Detector).

## Tech Stack

### Frontend
- React.js
- React Router
- Firebase Authentication

### Backend
- FastAPI
- PyTorch
- EfficientNetB3 pretrained + fine-tuned with Supervised Contrastive Learning
