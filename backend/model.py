import torch
from torchvision import transforms
from PIL import Image

from networks.architecture import SupConEfficientNet, SupConResNet, LinearClassifier

# ===== CONFIGURATION =====
CONFIG = {
    "encoder_weights_path": "./weights/supcon_efficientnetb3.pth",
    "classifier_weights_path": "./weights/classifier.pth",
    "device": "mps" if torch.backends.mps.is_available() else "cuda" if torch.cuda.is_available() else "cpu",
    "image_size": 300,
}

# ===== LOAD ENCODER =====
model = SupConEfficientNet(pretrained=False, head='mlp', feat_dim=128)
ckpt = torch.load(CONFIG["encoder_weights_path"], map_location=CONFIG["device"])
model.load_state_dict(ckpt)
encoder = model.encoder.to(CONFIG["device"])
encoder.eval()

# ===== LOAD CLASSIFIER =====
classifier = LinearClassifier(model='efficientnetb3', num_classes=2).to(CONFIG['device'])
classifier.load_state_dict(torch.load(CONFIG["classifier_weights_path"], map_location=CONFIG["device"]))
classifier.eval()

# ===== IMAGE TRANSFORM =====
transform = transforms.Compose([
        transforms.Resize(size=256),
        transforms.CenterCrop(size=CONFIG['image_size']),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406],
                             [0.229, 0.224, 0.225])
    ])

# ===== PREDICTION FUNCTION =====
def predict(image: Image.Image):
    """
    Accepts a PIL image, applies transforms, runs it through encoder + classifier,
    and returns predicted class and confidence.
    """

    image = transform(image).unsqueeze(0).to(CONFIG["device"])

    with torch.no_grad():
        features = encoder(image)
        features = torch.flatten(features, 1)  # match your val loop
        logits = classifier(features)
        probs = torch.softmax(logits, dim=1)
        confidence, prediction = torch.max(probs, dim=1)

    return int(prediction.item()), float(confidence.item())