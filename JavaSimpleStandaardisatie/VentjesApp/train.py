import keras
import tensorflow as tf
from keras.models import Sequential
from keras.layers import Dense, Dropout, Flatten
from keras.layers import Conv2D, MaxPooling2D
from keras.utils import to_categorical
from keras.preprocessing import image
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.utils import shuffle
from sklearn.model_selection import KFold
from tqdm import tqdm
from sklearn.utils import class_weight
from keras.metrics import categorical_accuracy
from keras.callbacks import EarlyStopping
from keras.callbacks import ModelCheckpoint
from keras.models import load_model

#mini batch gradient descent ftw
batch_size = 24
#optimal training time
epochs = 300
#Random State voor replicatie
random_state = 40

trainCSV = pd.read_csv('LabelsPer.csv')    # reading the csv file

train_image = []
for i in tqdm(range(trainCSV.shape[0])):
    img = image.load_img('Foto\\'+trainCSV['Id'][i]+'.png',target_size=(150,90,3)) #Het pad naar de foto's kan mogelijk incorrect zijn
    img = image.img_to_array(img)
    img = img/255
    train_image.append(img)
X = np.array(train_image)

y = np.array(trainCSV.drop(['Id'],axis=1))

classes = np.array(trainCSV.columns[1:])

X,y = shuffle (X,y,random_state=random_state)

sample_weights = class_weight.compute_sample_weight('balanced', y)

# K-fold cross-validation om te kijken welke fold, het 'beste' het neuraal netwerk traind.
# kfold = KFold(n_splits=5, shuffle=True, random_state=random_state)
# cvscores = []
# idx = 0
# for train, test in enumerate(kfold.split(X, y)):
  # create model
	# idx = idx + 1
	# model = Sequential()
	# model.add(Conv2D(filters=16, kernel_size=(5, 5), activation="relu", input_shape=(150,90,3)))
	# model.add(MaxPooling2D(pool_size=(2, 2)))
	# model.add(Dropout(0.25))
	# model.add(Conv2D(filters=32, kernel_size=(5, 5), activation='relu'))
	# model.add(MaxPooling2D(pool_size=(2, 2)))
	# model.add(Dropout(0.25))
	# model.add(Conv2D(filters=64, kernel_size=(5, 5), activation="relu"))
	# model.add(MaxPooling2D(pool_size=(2, 2)))
	# model.add(Dropout(0.25))
	# model.add(Conv2D(filters=64, kernel_size=(5, 5), activation='relu'))
	# model.add(MaxPooling2D(pool_size=(2, 2)))
	# model.add(Dropout(0.25))
	# model.add(Flatten())
	# model.add(Dense(128, activation='relu'))
	# model.add(Dropout(0.5))
	# model.add(Dense(64, activation='relu'))
	# model.add(Dropout(0.5))
	# model.add(Dense(16, activation='sigmoid'))
        #Checkpoint en EarlyStop
    # es = EarlyStopping(monitor='val_loss', mode='min', verbose=1, patience=30)
    # mc = ModelCheckpoint('model'+idx+'.h5', monitor='val_categorical_accuracy', mode='max', verbose=1, save_best_only=True)
	    # Compile
	# model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['categorical_accuracy'])
	    # Fit
	# hist = model.fit(X_train, y_train, epochs=200, validation_data=(X_test, y_test), batch_size=batch_size, class_weight=sample_weights)
	    # evaluate the model
	# scores = model.evaluate(X[test], y[test], verbose=0)
	# print("%s: %.2f%%" % (model.metrics_names[1], scores[1]*100))
	# cvscores.append(scores[1] * 100)
# print("%.2f%% (+/- %.2f%%)" % (np.mean(cvscores), np.std(cvscores)))

#Gebruikte methode om splitsing na k-fold cross-validatie
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=random_state)

model = Sequential()
model.add(Conv2D(filters=16, kernel_size=(5, 5), activation="relu", input_shape=(150,90,3)))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Dropout(0.25))
model.add(Conv2D(filters=32, kernel_size=(5, 5), activation='relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Dropout(0.25))
model.add(Conv2D(filters=64, kernel_size=(5, 5), activation="relu"))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Dropout(0.25))
model.add(Conv2D(filters=64, kernel_size=(5, 5), activation='relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Dropout(0.25))
model.add(Flatten())
model.add(Dense(128, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(64, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(16, activation='sigmoid'))
    #Checkpoint en EarlyStop
es = EarlyStopping(monitor='val_loss', mode='min', verbose=1, patience=30)
mc = ModelCheckpoint('model.h5', monitor='val_categorical_accuracy', mode='max', verbose=1, save_best_only=True)
    # Compile
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['categorical_accuracy'])
    # Fit
hist = model.fit(X_train, y_train, epochs=epochs, validation_data=(X_test, y_test), batch_size=batch_size, class_weight=sample_weights, callbacks=[es, mc])
    # Laad het 'beste' model
saved_model = load_model('model.h5')
# _, train_acc = saved_model.evaluate(X_train, y_train, verbose=0)
# _, test_acc = saved_model.evaluate(X_test, y_test, verbose=0)
# print('Train: %.3f, Test: %.3f' % (train_acc, test_acc))

#Opslaan van de model-structuur in JSON
# serialize model to JSON
saved_model_json = saved_model.to_json()
with open("model.json", "w") as json_file:
    json_file.write(saved_model_json)

#Plot Grafieken
#train_loss = hist.history['loss']
#val_loss = hist.history['val_loss']
#train_acc = hist.history['categorical_accuracy']
#val_acc = hist.history['val_categorical_accuracy']
#xc=range(429)

#plt.figure(1,figsize=(7,5))
#plt.plot(xc,train_loss)
#plt.plot(xc,val_loss)
#plt.xlabel('num of Epochs')
#plt.ylabel('loss')
#plt.title('train_loss vs val_loss')
#plt.grid(True)
#plt.legend(['train','val'])
#print plt.style.available # use bmh, classic,ggplot for big pictures
#plt.style.use(['classic'])

#plt.figure(2,figsize=(7,5))
#plt.plot(xc,train_acc)
#plt.plot(xc,val_acc)
#plt.xlabel('num of Epochs')
#plt.ylabel('accuracy')
#plt.title('train_acc vs val_acc')
#plt.grid(True)
#plt.legend(['train','val'],loc=4)
#plt.style.use(['classic'])

