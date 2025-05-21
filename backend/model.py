import torch
from torchvision import transforms
from PIL import Image

from networks.encoder import SupConEfficientNet, SupConResNet, LinearClassifier

CONFIG = {
    "weight_path": "../weights/classifier.pth",
    "device": "mps" if torch.backends.mps.is_available() else "cuda" if torch.cuda.is_available() else "cpu",
}

WEIGHT_PATH = "../weights/classifier.pth"
model = torch.load(CONFIG["weight_path"], map_location=CONFIG["device"])