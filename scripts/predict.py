# import modules
import sys
import cv2
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub

# path to the model
MODEL_PATH = 'scripts/dr_model.h5'

# dr model
MODEL = tf.keras.models.load_model((MODEL_PATH),custom_objects={'KerasLayer':hub.KerasLayer})

def get_prediction(image_path):    
    reshaped_image = get_reduced_image(image_path)
    prediction = MODEL.predict(reshaped_image)

    return prediction[0]

def get_reduced_image(image_path):
    image = cv2.imread(image_path)
    resized_image = cv2.resize(image, (224, 224))
    scaled_image = resized_image/255
    reshaped_image = np.reshape(scaled_image, [1, 224, 224, 3])
    return reshaped_image

print(get_prediction(sys.argv[1]))
sys.stdout.flush()