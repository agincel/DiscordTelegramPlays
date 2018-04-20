#Noah Goldstein 4/19/18

import win32api, win32con, math, time
import time,sys
def clickPoint(p):
	coord=p.split(",")
	mult = 1
	x=math.floor(float(coord[0])/mult) #specifically for 1.25x scaling on Windows 10 by default
	y=math.floor(float(coord[1])/mult)
	print("moving mouse to: "+str(x)+","+str(y))
	win32api.SetCursorPos((x,y))
	win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN,x,y,0,0)
	win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP,x,y,0,0)
if __name__ == "__main__":
    clickPoint(sys.argv[1])