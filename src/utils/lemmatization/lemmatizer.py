import sys
import json
import nltk
from nltk.stem import WordNetLemmatizer

lemmatizer = WordNetLemmatizer()

try:
    json_str = sys.argv[1]

    tokens = json.loads(json_str)

    lemmatized_tokens = [lemmatizer.lemmatize(token) for token in tokens]

    print(json.dumps(lemmatized_tokens))
    print('exit')
    sys.stdout.flush()

except Exception as e:
    sys.stderr.write(str(e))
    sys.stderr.flush()
