import json
import sys
import os

####################
# Global Variables #
####################

BASE_DIR = os.path.dirname(os.path.realpath(__file__))

DATA_DIR = '{0}/../data'.format( BASE_DIR )

OUTPUT_FILE = '{0}/formatted_dictionary.json'.format( DATA_DIR )

POS = {
    "a."      : "j",
    "adj"     : "j",
    "adv"     : "a",
    "adv."    : "a",
    "conj."   : "c",
    "interj." : "i",
    "n."      : "n",
    "noun"    : "n",
    "p."      : "s",  # "p." == past (I think?)
    "prep."   : "p",
    "pron."   : "o",
    "v."      : "v",
    "verb"    : "v"
}

######################
# Process Dictionary #
######################

output = []

dictionary = json.load( open( '{0}/dictionary.json'.format( DATA_DIR ), 'r' ) )
thesaurus  = open( '{0}/thesaurus.jsonl'.format( DATA_DIR ), 'r' ).read().splitlines()

print( 'Starting Dictionary...' )

for input_entry in dictionary:
    input_entry['word'] = input_entry['word'].lower()
    output_entry = next(
        ( x for x in output if x['n'] == input_entry['word'] ), False
    )
    if not output_entry:
        output_entry = { 'n' : input_entry['word'], 'd' : [] }
        output.append( output_entry )
    output_entry['d'].append({
        'd' : input_entry['definitions'],
        'p' : POS[ input_entry['pos'] ]
    })

print( 'Starting Thesaurus...' )

for input_entry in thesaurus:
    input_entry = json.loads( input_entry )
    input_entry['word'] = input_entry['word'].lower()
    output_entry = next(
        ( x for x in output if x['n'] == input_entry['word'] ), False
    )
    
    if output_entry:
        if 's' not in output_entry : output_entry[ 's' ] = []
        output_entry['s'].append({
            'w' : input_entry[ 'synonyms' ],
            'p' : POS[ input_entry['pos'] ]
        })

print( 'Dictionary : {0}'.format( len(dictionary) ) )
print( 'Thesaurus : {0}'.format( len(thesaurus) ) )
print( 'Output : {0}'.format( len(output) ) )
# print( len([ x for x in output if 's' in x ]) )

json.dump( output, open( OUTPUT_FILE, 'w' ) )

print( 'DONE!' )
