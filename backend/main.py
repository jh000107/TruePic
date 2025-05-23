import io
import requests
import os
import time

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager


from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from fake_useragent import UserAgent
from requests import Session

from dotenv import load_dotenv

from model import predict

app = FastAPI()

load_dotenv()

IMGBB_API_KEY = os.getenv("IMGBB_API_KEY")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")

    label, confidence = predict(image)

    result = {
        "predicted_class": label,
        "confidence": confidence,
    }

    return result

@app.post("/upload-imgbb")
async def upload_imgbb(file: UploadFile = File(...)):
    contents = await file.read()

    response = requests.post(
        "https://api.imgbb.com/1/upload",
        params={"key": IMGBB_API_KEY},
        files={"image": contents},
    )

    data = response.json()
    if not data.get("success"):
        return {"error": "Failed to upload to ImgBB"}
    
    return {"url": data["data"]["url"]}

@app.post("/google-reverse-search")
async def google_reverse_search(url: str = Form(...)):
    results = selenium_reverse_image_search(url)
    return {"results": results}

def selenium_reverse_image_search(image_url, max_results=5):
    # Set up Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--lang=en-US,en")
    chrome_options.add_experimental_option('prefs', {'intl.accept_languages': 'en-US,en'})
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
    
    # Initialize the driver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    
    try:
        # Navigate to Google Images
        driver.get("https://www.google.com/imghp?hl=en&gl=us")

        # Find and click the camera icon for reverse search
        camera_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[@aria-label='Search by image']"))
        )
        camera_button.click()
        
        # Wait for the URL input field and enter the image URL
        url_input = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//input[@placeholder='Paste image link']"))
        )

        url_input.send_keys(image_url)
        
        # Click search button
        search_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[text()='Search']"))
        )
        search_button.click()
        
        # Wait for results page to load
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.XPATH, "//div[contains(text(), 'All')]"))
        )
        
        # Extract similar image results
        similar_images = []
        
        # Click on "Find similar images" if available
        try:
            # Extract image data
            for i in range(max_results):
                try:
                    # Get image element using index in XPath
                    img_xpath = f"/html/body/div[3]/div/div[12]/div/div/div[2]/div[2]/div/div/div[1]/div/div/div/div/div/div/div[{i+1}]/div/div/div[1]/div/div/div/div/img"
                    img = WebDriverWait(driver, 5).until(
                        EC.presence_of_element_located((By.XPATH, img_xpath))
                    )
                    
                    # Get image URL by clicking and extracting from larger preview
                    img.click()
                    time.sleep(1)  # Wait for larger preview
                    
                    # Find the large image
                    img_container = WebDriverWait(driver, 5).until(
                        EC.presence_of_element_located((By.XPATH, "//*[@id='Sva75c']/div[2]/div[2]/div/div[2]/c-wiz/div/div[2]/div/a[1]"))
                    )

                    img_url = driver.find_element(By.XPATH, "//*[@id='Sva75c']/div[2]/div[2]/div/div[2]/c-wiz/div/div[2]/div/a[1]/img").get_attribute("src")

                    # Get source website
                    source_url = img_container.get_attribute("href")
                    
                    similar_images.append({
                        "url": img_url,
                        "source_url": source_url,
                    })
                except Exception as e:
                    print(f"Error extracting image {i+1}: {e}")
                    
        except Exception as e:
            print(f"Could not find 'similar images' link: {e}")

        return similar_images
        
    finally:
        # Clean up
        driver.quit()

    



    
    

