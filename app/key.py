#http://stackoverflow.com/questions/1823762/sendkeys-for-python-3-1-on-windows

import win32api
import win32con
import win32ui
import time,sys

keyDelay = 0.35
keymap = {
    "up": win32con.VK_UP,
    "left": win32con.VK_LEFT,
    "down": win32con.VK_DOWN,
    "right": win32con.VK_RIGHT,
    "shift": 0x10,
    "enter": 0x0D,
    "space": 0x20,
    "a": ord("A"),
    "b": ord("B"),
    "c": ord("C"),
    "d": ord("D"),
    "e": ord("E"),
    "f": ord("F"),
    "g": ord("G"),
    "h": ord("H"),
    "i": ord("I"),
    "j": ord("J"),
    "k": ord("K"),
    "l": ord("L"),
    "m": ord("M"),
    "n": ord("N"),
    "o": ord("O"),
    "p": ord("P"),
    "q": ord("Q"),
    "r": ord("R"),
    "s": ord("S"),
    "t": ord("T"),
    "u": ord("U"),
    "v": ord("V"),
    "w": ord("W"),
    "x": ord("X"),
    "y": ord("Y"),
    "z": ord("Z"),
    '0':0x30,
    '1':0x31,
    '2':0x32,
    '3':0x33,
    '4':0x34,
    '5':0x35,
    '6':0x36,
    '7':0x37,
    '8':0x38,
    '9':0x39,
}

def sendKey(button):
    win32api.keybd_event(keymap[button], 0, 0, 0)
    time.sleep(keyDelay)
    win32api.keybd_event(keymap[button], 0, win32con.KEYEVENTF_KEYUP, 0)

if __name__ == "__main__":
    #win = win32ui.FindWindow(None, sys.argv[2]) #add another argument with window name and comment out the next line if you want only a specific window
    win = win32ui.GetForegroundWindow()
    win.SetForegroundWindow()
    win.SetFocus()
    sendKey(sys.argv[1])
