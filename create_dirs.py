import os

dirs = [
    'src/components/Game',
    'src/components/UI',
    'src/components/Layout',
    'src/hooks',
    'src/contexts',
    'src/utils',
    'src/types'
]

for d in dirs:
    os.makedirs(d, exist_ok=True)

print('Directories created')
