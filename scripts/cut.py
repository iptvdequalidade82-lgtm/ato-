import numpy as np, cv2
from PIL import Image
from rembg import new_session, remove
s = new_session('isnet-general-use')
for n in ['maria','aline','liliane']:
    im = Image.open(f'{n}-src.png').convert('RGB')
    m = np.array(remove(im, session=s, only_mask=True)).astype(np.float32)/255
    a = np.clip((m-0.08)/0.84, 0, 1)
    a = cv2.GaussianBlur(a, (0,0), 1.0)
    img = np.array(im).astype(np.float32)/255
    # descontaminação da borda: a cor das bordas vem do interior do cabelo, não do fundo antigo
    hard = (a > 0.97).astype(np.float32)
    k = (0,0)
    num = cv2.GaussianBlur(img*hard[...,None], k, 6); den = cv2.GaussianBlur(hard, k, 6)[...,None]
    inner = np.where(den > 1e-3, num/np.maximum(den,1e-3), img)
    w = np.clip((0.97 - a)/0.97, 0, 1)[...,None]       # 0 no interior, 1 na borda externa
    F = img*(1-w) + inner*w
    np.save(f'{n}-alpha.npy', a); np.save(f'{n}-fg.npy', F)
    print(n,'ok',flush=True)
