from fastapi import FastAPI,Form, Request,UploadFile
from fastapi.responses import JSONResponse,FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os, base64, requests, subprocess
import google.generativeai as genai
from supabase import create_client
import re


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BHASHINI_USER_ID = "e832f2d25d21443e8bb90515f1079041"
BHASHINI_API_KEY = "39e27ce432-f79c-46f8-9c8c-c0856007cb4b"
GOOGLE_API_KEY = "AIzaSyDIeV6tBD3FyoE3vEIt07N0eMoAX_bm4RI"
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-pro-latest')

languages = {
    "Hindi": "hi", #hindi
    "Gom": "gom", #Gom
    "Kannade": "kn", #Kannada
    "Dogri": "doi", #Dogri    
    "Bodo": "brx", #Bodo 
    "Urdu": "ur",  #Urdu
    "Tamil": "ta",  #Tamil
    "Kashmiri": "ks",  #Kashmiri
    "Assamese": "as",  #Assamese
    "Bengali": "bn", #Bengali
    "Marathi": "mr", #Marathi
    "Sindhi": "sd", #Sindhi
    "Maihtili": "mai",#Maithili
    "Punjabi": "pa", #Punjabi
    "Malayalam": "ml", #Malayalam
    "Manipuri": "mni",#Manipuri
    "Telugu": "te", #Telugu
    "Sanskrit": "sa", #Sanskrit
    "Nepali": "ne", #Nepali
    "Santali": "sat",#Santali
    "Gujarati": "gu", #Gujarati
    "Oriya": "or", #Oriya
    "English": "en",#English
}

url = "https://mtjpsvvtuzhiopwuufri.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10anBzdnZ0dXpoaW9wd3V1ZnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgyMDc3NzIsImV4cCI6MjAzMzc4Mzc3Mn0.Nl-7D-ZTkrquyvhXTTburYd8Z1rkwx-BQJrX2rvJ5QQ"
supabase = create_client(url, key)



async def get_user_data():
    try:
        data = supabase.table("driver").select("driver_name,bus_number,next_stops_list,trip_start_time,trip_start_status,stopsList,bus_type").eq("language","English").execute()
        print("data from get_user_data", data.data)
        return data.data
    except Exception as e:
        print(f"Error: {str(e)}")
        return ({"response":"Unableto fetch the user detail"})



async def transcribe(source_lang, content):
    source_language = languages[source_lang]
    payload = {
        "pipelineTasks": [
            {
                "taskType": "asr",
                "config": {
                    "language": {
                        "sourceLanguage": source_language
                    }
                }
            }
        ],
        "pipelineRequestConfig": {
            "pipelineId" : "64392f96daac500b55c543cd"
        }
    }
    headers = {
        "Content-Type": "application/json",
        "userID": BHASHINI_USER_ID,
        "ulcaApiKey": BHASHINI_API_KEY
    }
    response = requests.post('https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline', json=payload, headers=headers)
    
    if response.status_code == 200:
        response_data = response.json()
        service_id = response_data["pipelineResponseConfig"][0]["config"][0]["serviceId"]

        compute_payload = {
            "pipelineTasks": [
                {
                    "taskType": "asr",
                    "config": {
                        "language": {
                            "sourceLanguage": source_language,
                        },
                        "serviceId": service_id
                    }
                }
            ],
            "inputData": {
                "audio": [
                    {
                        "audioContent": content
                    }
                ]
            }
        }

        callback_url = response_data["pipelineInferenceAPIEndPoint"]["callbackUrl"]
        
        headers2 = {
            response_data["pipelineInferenceAPIEndPoint"]["inferenceApiKey"]["name"]:
                response_data["pipelineInferenceAPIEndPoint"]["inferenceApiKey"]["value"]
        }

        compute_response = requests.post(callback_url, json=compute_payload, headers=headers2)

        if compute_response.status_code == 200:
            compute_response_data = compute_response.json()
            transcribed_content = compute_response_data["pipelineResponse"][0]["output"][0]["source"]
            return {
                "status_code": 200,
                "message": "Translation successful",
                "transcribed_content": transcribed_content
            }
        else:
            return {
                "status_code": compute_response.status_code,
                "message": "Error in translation",
                "transcribed_content": None
            }
    else:
        return {
            "status_code": response.status_code,
            "message": "Error in translation request",
            "transcribed_content": None
        }
    


async def text_to_speech(source_lang,content):
    source_language = languages[source_lang]
    payload = {
            "pipelineTasks": [
                {
                    "taskType": "tts",
                    "config": {
                        "language": {
                            "sourceLanguage": source_language,
                        }
                    }
                }
            ],
            "pipelineRequestConfig": {
                "pipelineId" : "64392f96daac500b55c543cd"
            }
        }

    headers = {
        "Content-Type": "application/json",
        "userID": BHASHINI_USER_ID,
        "ulcaApiKey": BHASHINI_API_KEY
    }

    response = requests.post('https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline', json=payload, headers=headers)

    if response.status_code == 200:
        response_data = response.json()
        service_id = response_data["pipelineResponseConfig"][0]["config"][0]["serviceId"]

        compute_payload={
            "pipelineTasks": [       
                {
                    "taskType": "tts",
                    "config": {
                        "language": {
                            "sourceLanguage": source_language
                        },
                        "serviceId": service_id,
                        "gender": "female"
                    }
                }
            ],
            "inputData": {
                "input": [
                    {
                        "source": content
                    }
                ],
                "audio": [
                    {
                        "audioContent": None
                    }
                ]
            }
        }

        callback_url = response_data["pipelineInferenceAPIEndPoint"]["callbackUrl"]
        
        headers2 = {
            "Content-Type": "application/json",
            response_data["pipelineInferenceAPIEndPoint"]["inferenceApiKey"]["name"]:
                response_data["pipelineInferenceAPIEndPoint"]["inferenceApiKey"]["value"]
        }

        compute_response = requests.post(callback_url, json=compute_payload, headers=headers2)

        if compute_response.status_code == 200:
            compute_response_data = compute_response.json()
            tts_b64 = compute_response_data["pipelineResponse"][0]["audio"][0]["audioContent"]
            return {
                "status_code": 200,
                "message": "Translation successful",
                "tts_base64": tts_b64
            }
        else:
            return {
                "status_code": compute_response.status_code,
                "message": "Error in translation",
                "tts_base64": None
            }
    else:
        return {
            "status_code": response.status_code,
            "message": "Error in translation request",
            "tts_base64": None
        }



async def translation(source_lang, target_lang, content):
    source_language = languages[source_lang]
    target_language = languages[target_lang]
    payload = {
        "pipelineTasks": [
            {
                "taskType": "translation",
                "config": {
                    "language": {
                        "sourceLanguage": source_language,
                        "targetLanguage": target_language
                    }
                }
            }
        ],
        "pipelineRequestConfig": {
            "pipelineId" : "64392f96daac500b55c543cd"
        }
    }
    headers = {
        "Content-Type": "application/json",
        "userID": BHASHINI_USER_ID,
        "ulcaApiKey": BHASHINI_API_KEY
    }
    response = requests.post('https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline', json=payload, headers=headers)
    if response.status_code == 200:
        response_data = response.json()
        service_id = response_data["pipelineResponseConfig"][0]["config"][0]["serviceId"]

        compute_payload = {
            "pipelineTasks": [
                {
                    "taskType": "translation",
                    "config": {
                        "language": {
                            "sourceLanguage": source_language,
                            "targetLanguage": target_language
                        },
                        "serviceId": service_id
                    }
                }
            ],
            "inputData": {
                "input": [
                    {
                        "source": content
                    }
                ],
                "audio": [
                    {
                        "audioContent": None
                    }
                ]
            }
        }
        callback_url = response_data["pipelineInferenceAPIEndPoint"]["callbackUrl"]
        headers2 = {
            "Content-Type": "application/json",
            response_data["pipelineInferenceAPIEndPoint"]["inferenceApiKey"]["name"]:
                response_data["pipelineInferenceAPIEndPoint"]["inferenceApiKey"]["value"]
        }
        compute_response = requests.post(callback_url, json=compute_payload, headers=headers2)
        if compute_response.status_code == 200:
            compute_response_data = compute_response.json()
            translated_content = compute_response_data["pipelineResponse"][0]["output"][0]["target"]
            return {
                "status_code": 200,
                "message": "Translation successful",
                "translated_content": translated_content
            }
        else:
            return {
                "status_code": compute_response.status_code,
                "message": "Error in translation",
                "translated_content": None
            }
    else:
        return {
            "status_code": response.status_code,
            "message": "Error in translation request",
            "translated_content": None
        }
    

@app.get("/supabsae")
async def supabsae():
    result = await get_user_data()
    return JSONResponse(content={"response": result, "success":True},status_code = 200)



@app.post("/chatbot")
async def chatbot(dropdown: str=Form(...), source_lang: str=Form(...), text: str=Form(...)):
    try:
        if source_lang=="English":
            supabase_result = await get_user_data()
            query = f"I am providing you below with the details of my bus, bus number and user query. Based on the details, provide a relevant response to the user's query.\n\nBus details: {supabase_result}\n\nBus Number:{dropdown}\n\nUser Query:{text}"
            response = model.generate_content(query)
            return JSONResponse(content={"response":response.text,"success":True},status_code=200)
        else:
            user_query = await translation(source_lang,'English',text)
            response = model.generate_content(user_query['translated_content'])
            translated_response = await translation('English',source_lang,response.text)
            return JSONResponse(content={"response":translated_response['translated_content'],"success":True},status_code=200)
    except Exception as e:
        print("Error occured in chatbot function: ", str(e))
        return JSONResponse(content={"response":str(e),"success":False},status_code=500)
    

def clean_text(text):
    # Remove unwanted characters like asterisks and newline
    cleaned_text = re.sub(r'[*\n]', '', text)
    # Replace multiple spaces with a single space
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text)
    # Strip leading and trailing whitespace
    cleaned_text = cleaned_text.strip()
    return cleaned_text


@app.post('/chattext')
async def chattext(dropdown: str=Form(...),language: str=Form(...),text:str=Form(...)):
    try:
        # text = await request.json()
        '''
        dropdown=102
        translate_text = None
        reponse = await request.json()
        text = reponse["message"]
        language = reponse["language"]
        '''
        if language == "English":
            translate_text = text
        else:
            translate_response = await translation(language,"English",text)
            translate_text = translate_response["translated_content"]
        supabase_result = await get_user_data()
        print("\n\n")
        print(translate_text)
        query = f"""You are an intelligent chatbot designed to assist users with queries related to a bus service. The bus service database contains the following columns:
1. *bus_number*: The unique identifier for each bus route.
2. *driver_name*: The name of the driver assigned to the bus.
3. *bus_type*: The type i.e size of the bus.
4. *next_stops_list*: A list of bus stops the bus is yet to cover.The list below is for your example if user asks for bus location.[
    "BACKBAY BUS DEPOT",
    "CSMT BUS STATION",
    "MARINE LINES BUS STATION",
    "BALLARD PIER BUS STOP",
    "PRIYADARSHANI PARK BUS STOP",
    "WADALA BUS DEPOT",
    "MAHIM BUS DEPOT",
    "KHODADAD CIRCLE DADAR EAST",
    "RANI LAXMIBAI BUS STATION SION",
    "BANDRA WEST BUS DEPOT",
    "PRABODHANKAR THACKRAY UDAYAN SEWRI",
    "AGARKAR CHOWK BUS STOP ANDHERI EAST"
  ]  in this list if the bus is still at backbay tell that it is near backbay but if it has crossed backbay and is moving towards csmt bus station, tell that it is between the two respective bus stops. 
5. *stopsList*: A comprehensive list of all the stops from source to destination for the bus route. The first entry in the stopsList gives the source bus stop and the last entry in the list gives Destination of the bus.
6. *trip_start_time*: The scheduled start time of the bus trip.
7. *trip_start_status*: A status indicator showing whether the trip has started or not. Please give me plain text in readable format. Don't use unwanted signs and symbols.include commas wherever while listing bus stop names.
.\n\nBus details: {supabase_result}\n\nBus Number:{dropdown}\n\nUser Query:{translate_text}"""
        response_gemini = model.generate_content(query)
        response = clean_text(response_gemini.text)
        if language == "English":
            return JSONResponse(content={"message":response, "success":True}, status_code=200)
        else:
            translated_resp = await translation("English",language,response)
            return JSONResponse(content={"message":translated_resp["translated_content"], "success":True}, status_code=200)
    except Exception as e:
        print(str(e))
        return JSONResponse(content={"message":"Failure ho gaya", "success":False}, status_code=500)
    

@app.post('/chat_audio')
async def chataudio(language: str = Form(...), file: UploadFile = Form(...)):
    try:
        print(language)
        command = ["ffmpeg", "-i", "-", "-acodec", "libmp3lame", "-f", "mp3", "-"]
        process = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        file_content = await file.read()
        output, error = process.communicate(input=file_content)
        if process.returncode != 0:
            return JSONResponse(status_code=500, content={"message":f"FFmpeg error: {error.decode()}"})
        base64_encoded_data = base64.b64encode(output).decode('utf-8')
        source_text = await transcribe(language,base64_encoded_data)
        text = source_text["transcribed_content"]
        return JSONResponse(content={"message": text, "success": True}, status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content={"message": "Try failure", "success": False}, status_code=500)