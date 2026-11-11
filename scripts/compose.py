import numpy as np, cv2
from PIL import Image, ImageFilter
BG = np.array([0xE6,0xE4,0xDF])/255.0   # pedra clara, harmoniza com o off-white do site
OUT_W, OUT_H = 1200, 1500
# caixas do rosto (linha do cabelo ao queixo), medidas nas fotos originais
faces = {'maria': (450,210,270,360), 'aline': (470,105,230,270), 'liliane': (455,200,290,380)}
# tamanho da cabeça igual: rosto ocupa 36% da altura do quadro, olhos (~40% da face) a 38% da altura
for n,(x,y,w,h) in faces.items():
    a = np.load(f'{n}-alpha.npy'); F = np.load(f'{n}-fg.npy'); H,W = a.shape
    # tom: leve ajuste de luminância da pele para um alvo comum, só no sujeito
    face = F[y:y+h, x:x+w]; lum = (face@[0.299,0.587,0.114]).mean()
    gain = np.clip(0.58/lum, 0.96, 1.05)
    F = np.clip(F*gain, 0, 1)
    if n == 'aline':  # luz de palco quente: aproxima a pele do tom das outras fotos
        g = (F@[0.299,0.587,0.114])[...,None]; F = np.clip(g + (F-g)*0.86, 0, 1)
    comp = F*a[...,None] + BG*(1-a[...,None])
    fh = h/0.36; fw = fh*OUT_W/OUT_H
    cx = x+w/2
    hair_top = int(np.argmax(a.max(axis=1) > 0.5)); top = hair_top - 0.075*fh  # mesmo respiro acima da cabeça
    bottom = top+fh
    if bottom > H-2:                 # nunca mostrar o corte inferior da foto original
        s = (H-2-top)/fh; fh*=s; fw*=s; bottom = top+fh
    left = cx-fw/2
    # tela maior preenchida com o fundo, para quadros que passam do topo/lados
    pad = 600
    canvas = np.ones((H+2*pad, W+2*pad, 3))*BG; canvas[pad:pad+H, pad:pad+W] = comp
    box = (int(left+pad), int(top+pad), int(left+pad+fw), int(top+pad+fh))
    img = Image.fromarray((canvas*255).astype(np.uint8)).crop(box).resize((OUT_W,OUT_H), Image.LANCZOS)
    img = img.filter(ImageFilter.UnsharpMask(radius=1.2, percent=40, threshold=3))
    img.save(f'{n}.png'); print(n, 'gain', round(float(gain),3), 'scale', round(OUT_H/fh,2))
