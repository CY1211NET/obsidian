import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import os
from pathlib import Path
import yaml
from datetime import datetime
import threading

# Import the logic from our existing script
try:
    from frontmatter_manager import FrontMatterManager
except ImportError:
    # If running directly or import fails, we might need to adjust path or copy logic
    # For now assuming it's in the same directory
    import sys
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    from frontmatter_manager import FrontMatterManager

class FrontMatterGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Front Matter 管理工具")
        self.root.geometry("1200x800")
        
        # Initialize manager
        self.base_dir = Path('./posts')
        self.manager = None
        self.current_file = None
        self.file_list = []
        
        self.setup_ui()
        self.load_directory()

    def setup_ui(self):
        # Main container with split view
        self.paned_window = ttk.PanedWindow(self.root, orient=tk.HORIZONTAL)
        self.paned_window.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # Left Panel - File List
        self.left_frame = ttk.Frame(self.paned_window)
        self.paned_window.add(self.left_frame, weight=1)
        
        # Toolbar for Left Panel
        self.left_toolbar = ttk.Frame(self.left_frame)
        self.left_toolbar.pack(fill=tk.X, pady=2)
        
        ttk.Button(self.left_toolbar, text="📂 打开目录", command=self.select_directory).pack(side=tk.LEFT, padx=2)
        ttk.Button(self.left_toolbar, text="🔄 刷新", command=self.refresh_list).pack(side=tk.LEFT, padx=2)
        
        # File Treeview
        self.tree = ttk.Treeview(self.left_frame, columns=("status"), show="tree headings")
        self.tree.heading("#0", text="文件列表")
        self.tree.heading("status", text="状态")
        self.tree.column("status", width=50)
        self.tree.pack(fill=tk.BOTH, expand=True)
        self.tree.bind("<<TreeviewSelect>>", self.on_file_select)
        
        # Scrollbar for tree
        scrollbar = ttk.Scrollbar(self.left_frame, orient="vertical", command=self.tree.yview)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.tree.configure(yscrollcommand=scrollbar.set)
        
        # Right Panel - Editor
        self.right_frame = ttk.Frame(self.paned_window)
        self.paned_window.add(self.right_frame, weight=3)
        
        # Editor Container
        self.editor_container = ttk.LabelFrame(self.right_frame, text="编辑 Front Matter")
        self.editor_container.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # Form Fields
        self.create_form_fields()
        
        # Buttons
        self.button_frame = ttk.Frame(self.right_frame)
        self.button_frame.pack(fill=tk.X, pady=10, padx=5)
        
        ttk.Button(self.button_frame, text="💾 保存更改", command=self.save_changes).pack(side=tk.RIGHT, padx=5)
        ttk.Button(self.button_frame, text="✨ 自动填充缺失", command=self.auto_fill).pack(side=tk.RIGHT, padx=5)
        
        # Preview Area
        self.preview_frame = ttk.LabelFrame(self.right_frame, text="YAML 预览")
        self.preview_frame.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        self.preview_text = tk.Text(self.preview_frame, height=10, font=("Consolas", 10))
        self.preview_text.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)

    def create_form_fields(self):
        # Scrollable frame for fields
        self.canvas = tk.Canvas(self.editor_container)
        self.scrollbar = ttk.Scrollbar(self.editor_container, orient="vertical", command=self.canvas.yview)
        self.scrollable_frame = ttk.Frame(self.canvas)

        self.scrollable_frame.bind(
            "<Configure>",
            lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all"))
        )

        self.canvas.create_window((0, 0), window=self.scrollable_frame, anchor="nw")
        self.canvas.configure(yscrollcommand=self.scrollbar.set)

        self.canvas.pack(side="left", fill="both", expand=True)
        self.scrollbar.pack(side="right", fill="y")

        # Fields definition
        self.fields = {
            'title': '文章标题',
            'description': 'SEO 摘要',
            'date': '创建日期',
            'updated': '更新日期',
            'category': '分类',
            'tags': '标签 (逗号分隔)',
            'author': '作者',
            'draft': '草稿 (true/false)',
            'cover': '封面图 URL'
        }
        
        self.entries = {}
        
        row = 0
        for key, label in self.fields.items():
            ttk.Label(self.scrollable_frame, text=f"{label}:").grid(row=row, column=0, sticky="w", padx=5, pady=5)
            entry = ttk.Entry(self.scrollable_frame, width=50)
            entry.grid(row=row, column=1, sticky="ew", padx=5, pady=5)
            self.entries[key] = entry
            
            # Bind change event to preview update
            entry.bind('<KeyRelease>', self.update_preview)
            
            row += 1

    def select_directory(self):
        dir_path = filedialog.askdirectory(initialdir=self.base_dir)
        if dir_path:
            self.base_dir = Path(dir_path)
            self.load_directory()

    def load_directory(self):
        try:
            self.manager = FrontMatterManager(str(self.base_dir))
            self.refresh_list()
        except Exception as e:
            messagebox.showerror("错误", f"无法加载目录: {e}")

    def refresh_list(self):
        # Clear tree
        for item in self.tree.get_children():
            self.tree.delete(item)
            
        if not self.manager:
            return

        files = self.manager.find_markdown_files()
        
        # Group by subdirectory
        dirs = {}
        
        for filepath in files:
            rel_path = filepath.relative_to(self.base_dir)
            parts = rel_path.parts
            
            if len(parts) > 1:
                parent = parts[0]
                if parent not in dirs:
                    dirs[parent] = self.tree.insert("", "end", text=parent, open=True)
                
                self.tree.insert(dirs[parent], "end", text=parts[-1], values=("",), tags=(str(filepath),))
            else:
                self.tree.insert("", "end", text=parts[0], values=("",), tags=(str(filepath),))

    def on_file_select(self, event):
        selection = self.tree.selection()
        if not selection:
            return
            
        item = selection[0]
        tags = self.tree.item(item, "tags")
        
        if not tags:
            return # Probably a directory
            
        filepath = Path(tags[0])
        self.load_file(filepath)

    def load_file(self, filepath):
        self.current_file = filepath
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        frontmatter, _, self.body_content = self.manager.parse_frontmatter(content)
        
        if frontmatter is None:
            frontmatter = {}
            
        # Fill form
        for key, entry in self.entries.items():
            entry.delete(0, tk.END)
            val = frontmatter.get(key, '')
            
            if isinstance(val, list):
                val = ', '.join(str(v) for v in val)
            elif isinstance(val, bool):
                val = str(val).lower()
            elif val is None:
                val = ''
                
            entry.insert(0, str(val))
            
        self.update_preview()

    def get_form_data(self):
        data = {}
        for key, entry in self.entries.items():
            val = entry.get().strip()
            if val:
                if key == 'tags':
                    data[key] = [t.strip() for t in val.split(',') if t.strip()]
                elif key == 'draft':
                    data[key] = val.lower() == 'true'
                else:
                    data[key] = val
        return data

    def update_preview(self, event=None):
        if not self.current_file:
            return
            
        data = self.get_form_data()
        preview = self.manager.generate_frontmatter(data)
        
        self.preview_text.delete('1.0', tk.END)
        self.preview_text.insert('1.0', preview)

    def auto_fill(self):
        if not self.current_file:
            return
            
        current_data = self.get_form_data()
        suggestions = self.manager.suggest_missing_fields(current_data, self.current_file)
        
        for key, val in suggestions.items():
            if key in self.entries:
                entry = self.entries[key]
                if not entry.get().strip():
                    entry.delete(0, tk.END)
                    
                    if isinstance(val, list):
                        val = ', '.join(str(v) for v in val)
                    elif isinstance(val, bool):
                        val = str(val).lower()
                        
                    entry.insert(0, str(val))
        
        self.update_preview()
        messagebox.showinfo("提示", "已自动填充缺失字段")

    def save_changes(self):
        if not self.current_file:
            return
            
        try:
            data = self.get_form_data()
            fm_str = self.manager.generate_frontmatter(data)
            
            new_content = fm_str + self.body_content
            
            with open(self.current_file, 'w', encoding='utf-8') as f:
                f.write(new_content)
                
            messagebox.showinfo("成功", f"已保存文件: {self.current_file.name}")
            
            # Update tree status (optional)
            selection = self.tree.selection()
            if selection:
                self.tree.set(selection[0], "status", "✅")
                
        except Exception as e:
            messagebox.showerror("错误", f"保存失败: {e}")

if __name__ == "__main__":
    root = tk.Tk()
    # Set theme if available
    try:
        style = ttk.Style()
        style.theme_use('clam')
    except:
        pass
        
    app = FrontMatterGUI(root)
    root.mainloop()
