import tkinter as tk
import random
import math

class StarCalculator:
    def __init__(self, root):
        self.root = root
        self.root.title("Stardust Calculator")
        self.root.geometry("400x650")
        self.root.resizable(False, False)
        
        # Configure canvas
        self.canvas = tk.Canvas(root, width=400, height=650, highlightthickness=0)
        self.canvas.pack(fill="both", expand=True)
        
        self.draw_gradient()
        
        # Collections
        self.stars = []
        self.shooting_stars = []
        
        # Generate Stardust
        for _ in range(250):
            x = random.randint(0, 400)
            y = random.randint(0, 650)
            is_dust = random.random() < 0.4
            
            if is_dust:
                size = random.uniform(0.1, 1.0)
                speed_y = random.uniform(0.5, 2.0)
                speed_x = random.uniform(-0.5, 0.5)
                twinkle_speed = random.uniform(0.1, 0.4)
                color = random.choice(["#E0F7FA", "#B3E5FC", "#81D4FA", "#FFFFFF"])
            else:
                size = random.uniform(1.0, 2.5)
                speed_y = random.uniform(0.05, 0.4)
                speed_x = random.uniform(-0.1, 0.1)
                twinkle_speed = random.uniform(0.02, 0.1)
                color = random.choice(["#FFFFFF", "#FFFDE7", "#D1C4E9", "#F8BBD0"])
                
            star = self.canvas.create_oval(x, y, x+size, y+size, fill=color, outline="")
            self.stars.append({
                "id": star, "x": x, "y": y, "sy": speed_y, "sx": speed_x, 
                "base_size": size, "twinkle": twinkle_speed, "angle": random.uniform(0, math.pi*2),
                "color": color
            })
            
        self.expression = ""
        
        # Display Box (with stipple for semi-transparency)
        self.display_bg = self.canvas.create_rectangle(
            20, 30, 380, 130, 
            outline="#7E57C2", width=2, fill=""
        )
        self.display_text = self.canvas.create_text(
            360, 80, text="0", fill="#FFFFFF", 
            font=("Segoe UI", 40, "bold"), anchor="e"
        )
        
        self.buttons = []
        self.create_buttons()
        
        self.canvas.bind("<Button-1>", self.on_click)
        self.canvas.bind("<Motion>", self.on_hover)
        
        # Start animation
        self.animate_stars()

    def draw_gradient(self):
        # Dark space gradient
        for i in range(650):
            # from top dark blue/black to bottom deep purple
            r = int(5 + (30 - 5) * i / 650)
            g = int(5 + (15 - 5) * i / 650)
            b = int(20 + (50 - 20) * i / 650)
            color = f'#{r:02x}{g:02x}{b:02x}'
            self.canvas.create_line(0, i, 400, i, fill=color)

    def animate_stars(self):
        mouse_x = self.root.winfo_pointerx() - self.root.winfo_rootx()
        mouse_y = self.root.winfo_pointery() - self.root.winfo_rooty()
        
        # Update normal stars
        for star in self.stars:
            star["x"] += star["sx"]
            star["y"] += star["sy"]
            star["angle"] += star["twinkle"]
            
            # Twinkling effect
            current_size = star["base_size"] + math.sin(star["angle"]) * 0.8
            if current_size < 0.1: current_size = 0.1
            
            # Mouse repulsion effect
            if 0 <= mouse_x <= 400 and 0 <= mouse_y <= 650:
                dx = star["x"] - mouse_x
                dy = star["y"] - mouse_y
                dist = math.hypot(dx, dy)
                if 0 < dist < 70:
                    force = (70 - dist) / 70
                    star["x"] += dx / dist * force * 4
                    star["y"] += dy / dist * force * 4
            
            # Screen wrap
            if star["y"] > 660:
                star["y"] = -10
                star["x"] = random.randint(0, 400)
            elif star["y"] < -10:
                star["y"] = 660
                star["x"] = random.randint(0, 400)
                
            if star["x"] > 410:
                star["x"] = -10
            elif star["x"] < -10:
                star["x"] = 410
                
            self.canvas.coords(star["id"], star["x"], star["y"], star["x"]+current_size, star["y"]+current_size)
            
        # Spawn shooting stars occasionally
        if random.random() < 0.015:
            x = random.randint(50, 350)
            y = -20
            size = random.uniform(1.5, 2.5)
            sx = random.uniform(-3, 3)
            sy = random.uniform(8, 15)
            color = "#FFFFFF"
            head = self.canvas.create_oval(x, y, x+size, y+size, fill=color, outline="")
            tail = self.canvas.create_line(x, y, x-sx*3, y-sy*3, fill=color, width=size-0.5)
            self.shooting_stars.append({
                "head": head, "tail": tail, 
                "x": x, "y": y, "sx": sx, "sy": sy, 
                "size": size, "life": 40
            })
            
        # Update shooting stars
        for ss in self.shooting_stars[:]:
            ss["x"] += ss["sx"]
            ss["y"] += ss["sy"]
            ss["life"] -= 1
            
            self.canvas.coords(ss["head"], ss["x"], ss["y"], ss["x"]+ss["size"], ss["y"]+ss["size"])
            self.canvas.coords(ss["tail"], ss["x"], ss["y"], ss["x"]-ss["sx"]*4, ss["y"]-ss["sy"]*4)
            
            if ss["life"] <= 0 or ss["y"] > 700:
                self.canvas.delete(ss["head"])
                self.canvas.delete(ss["tail"])
                self.shooting_stars.remove(ss)
            
        self.root.after(30, self.animate_stars)

    def create_buttons(self):
        btn_layout = [
            [('C', '#FF5252'), ('⌫', '#FF8A65'), ('%', '#00E5FF'), ('/', '#00E5FF')],
            [('7', '#FFFFFF'), ('8', '#FFFFFF'), ('9', '#FFFFFF'), ('*', '#00E5FF')],
            [('4', '#FFFFFF'), ('5', '#FFFFFF'), ('6', '#FFFFFF'), ('-', '#00E5FF')],
            [('1', '#FFFFFF'), ('2', '#FFFFFF'), ('3', '#FFFFFF'), ('+', '#00E5FF')],
            [('0', '#FFFFFF'), ('.', '#FFFFFF'), ('=', '#FFD740'), ('=', '#FFD740')]
        ]
        
        start_y = 160
        padding = 15
        btn_w = (400 - 5 * padding) / 4
        btn_h = 75
        
        for row_idx, row in enumerate(btn_layout):
            y = start_y + row_idx * (btn_h + padding)
            col_idx = 0
            while col_idx < len(row):
                text, color = row[col_idx]
                x = padding + col_idx * (btn_w + padding)
                
                width_mult = 1
                if col_idx < len(row) - 1 and row[col_idx+1][0] == text:
                    width_mult = 2
                    col_idx += 1
                
                w = btn_w * width_mult + padding * (width_mult - 1)
                
                btn_rect = self.canvas.create_rectangle(
                    x, y, x+w, y+btn_h, 
                    outline="#4527A0", width=2, fill=""
                )
                
                btn_text = self.canvas.create_text(
                    x+w/2, y+btn_h/2, 
                    text=text, fill=color, 
                    font=("Segoe UI", 24, "bold")
                )
                
                self.buttons.append({
                    "rect": btn_rect,
                    "text_id": btn_text,
                    "text": text,
                    "x1": x, "y1": y, "x2": x+w, "y2": y+btn_h,
                    "hover": False,
                    "default_color": "#4527A0"
                })
                
                col_idx += 1

    def on_hover(self, event):
        x, y = event.x, event.y
        for btn in self.buttons:
            if btn["x1"] <= x <= btn["x2"] and btn["y1"] <= y <= btn["y2"]:
                if not btn["hover"]:
                    self.canvas.itemconfig(btn["rect"], outline="#B388FF", width=3)
                    btn["hover"] = True
            else:
                if btn["hover"]:
                    self.canvas.itemconfig(btn["rect"], outline=btn["default_color"], width=2)
                    btn["hover"] = False

    def on_click(self, event):
        x, y = event.x, event.y
        for btn in self.buttons:
            if btn["x1"] <= x <= btn["x2"] and btn["y1"] <= y <= btn["y2"]:
                self.handle_button(btn["text"])
                # Click animation
                self.canvas.move(btn["rect"], 0, 3)
                self.canvas.move(btn["text_id"], 0, 3)
                self.canvas.itemconfig(btn["rect"], outline="#FFFFFF")
                
                self.root.after(100, lambda b=btn: self.canvas.move(b["rect"], 0, -3))
                self.root.after(100, lambda b=btn: self.canvas.move(b["text_id"], 0, -3))
                self.root.after(100, lambda b=btn: self.canvas.itemconfig(b["rect"], outline="#B388FF" if b["hover"] else b["default_color"]))
                break
                
    def handle_button(self, value):
        if value == 'C':
            self.expression = ""
        elif value == '⌫':
            self.expression = self.expression[:-1]
        elif value == '=':
            try:
                safe_expr = self.expression.replace('%', '/100')
                if not safe_expr: return
                result = str(eval(safe_expr))
                if '.' in result:
                    result = str(round(float(result), 8)).rstrip('0').rstrip('.')
                self.expression = result
            except Exception:
                self.expression = "Error"
        else:
            if self.expression == "Error":
                self.expression = ""
            
            # Prevent multiple operators in a row
            if value in "/*+-%" and self.expression and self.expression[-1] in "/*+-%":
                self.expression = self.expression[:-1] + value
            else:
                self.expression += value
            
        display_str = self.expression if self.expression else "0"
        
        # Handle long text
        if len(display_str) > 12:
            self.canvas.itemconfig(self.display_text, font=("Segoe UI", 24, "bold"))
        elif len(display_str) > 8:
            self.canvas.itemconfig(self.display_text, font=("Segoe UI", 32, "bold"))
        else:
            self.canvas.itemconfig(self.display_text, font=("Segoe UI", 40, "bold"))
            
        self.canvas.itemconfig(self.display_text, text=display_str)

if __name__ == "__main__":
    root = tk.Tk()
    app = StarCalculator(root)
    root.mainloop()
