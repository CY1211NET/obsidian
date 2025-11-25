#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Front Matter 批量管理工具
用于检查和修改 Markdown 文件的 front matter 字段
"""

import os
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import yaml


class FrontMatterManager:
    """Front Matter 管理器"""
    
    # 必需和可选字段定义
    REQUIRED_FIELDS = {
        'title': '文章标题（必须）',
        'date': '创建时间，决定文章顺序',
        'category': '分类（一般 1 个）',
        'tags': '多标签',
    }
    
    OPTIONAL_FIELDS = {
        'description': 'SEO 摘要，Google 会显示',
        'updated': '更新日期',
        'draft': '草稿，不会发布',
        'author': '作者名',
        'cover': '封面图 URL',
        'excerpt': '文章摘要',
        'readTime': '阅读时间',
    }
    
    def __init__(self, posts_dir: str = './posts'):
        """初始化管理器"""
        self.posts_dir = Path(posts_dir)
        if not self.posts_dir.exists():
            raise ValueError(f"目录不存在: {posts_dir}")
    
    def find_markdown_files(self) -> List[Path]:
        """递归查找所有 markdown 文件"""
        md_files = []
        for root, dirs, files in os.walk(self.posts_dir):
            for file in files:
                if file.endswith('.md'):
                    md_files.append(Path(root) / file)
        return sorted(md_files)
    
    def parse_frontmatter(self, content: str) -> Tuple[Optional[Dict], str, str]:
        """
        解析 front matter
        返回: (frontmatter_dict, frontmatter_raw, body_content)
        """
        # 匹配 YAML front matter (--- ... ---)
        pattern = r'^---\s*\n(.*?)\n---\s*\n(.*)$'
        match = re.match(pattern, content, re.DOTALL)
        
        if not match:
            return None, '', content
        
        frontmatter_raw = match.group(1)
        body = match.group(2)
        
        try:
            frontmatter = yaml.safe_load(frontmatter_raw) or {}
        except yaml.YAMLError as e:
            print(f"⚠️  YAML 解析错误: {e}")
            return None, frontmatter_raw, body
        
        return frontmatter, frontmatter_raw, body
    
    def generate_frontmatter(self, data: Dict) -> str:
        """生成 front matter 字符串"""
        # 按照特定顺序排列字段
        field_order = [
            'title', 'description', 'date', 'updated', 'updatedAt',
            'category', 'tags', 'draft', 'author', 'cover', 
            'excerpt', 'readTime'
        ]
        
        ordered_data = {}
        # 先添加有序字段
        for field in field_order:
            if field in data:
                ordered_data[field] = data[field]
        
        # 再添加其他字段
        for key, value in data.items():
            if key not in ordered_data:
                ordered_data[key] = value
        
        # 生成 YAML
        yaml_str = yaml.dump(
            ordered_data,
            allow_unicode=True,
            default_flow_style=False,
            sort_keys=False
        )
        
        return f"---\n{yaml_str}---\n"
    
    def suggest_missing_fields(self, frontmatter: Dict, filepath: Path) -> Dict:
        """为缺失字段提供建议值"""
        suggestions = {}
        
        # title - 如果没有，使用文件名
        if 'title' not in frontmatter or not frontmatter['title']:
            suggestions['title'] = filepath.stem
        
        # date - 如果没有，使用文件修改时间
        if 'date' not in frontmatter or not frontmatter['date']:
            mtime = datetime.fromtimestamp(filepath.stat().st_mtime)
            suggestions['date'] = mtime.strftime('%Y-%m-%d')
        
        # category - 如果在子目录中，使用目录名
        if 'category' not in frontmatter or not frontmatter['category']:
            parent_dir = filepath.parent.name
            if parent_dir != 'posts':
                suggestions['category'] = parent_dir
            else:
                suggestions['category'] = 'Uncategorized'
        
        # tags - 如果没有，提供空列表
        if 'tags' not in frontmatter or not frontmatter['tags']:
            suggestions['tags'] = []
        
        # author - 默认作者
        if 'author' not in frontmatter or not frontmatter['author']:
            suggestions['author'] = 'Crain'
        
        # draft - 默认为 false
        if 'draft' not in frontmatter:
            suggestions['draft'] = False
        
        return suggestions
    
    def display_comparison(self, original: str, modified: str, filepath: Path):
        """并排显示原始和修改后的 front matter"""
        print("\n" + "=" * 80)
        print(f"📄 文件: {filepath.relative_to(self.posts_dir)}")
        print("=" * 80)
        
        # 分割成行
        original_lines = original.strip().split('\n')
        modified_lines = modified.strip().split('\n')
        
        max_len = max(len(original_lines), len(modified_lines))
        
        # 打印表头
        print(f"{'原始 Front Matter':<40} | {'修改后 Front Matter':<40}")
        print("-" * 80)
        
        # 并排显示
        for i in range(max_len):
            left = original_lines[i] if i < len(original_lines) else ''
            right = modified_lines[i] if i < len(modified_lines) else ''
            
            # 高亮显示差异
            if left != right:
                print(f"\033[91m{left:<40}\033[0m | \033[92m{right:<40}\033[0m")
            else:
                print(f"{left:<40} | {right:<40}")
        
        print("-" * 80)
    
    def process_file(self, filepath: Path, auto_mode: bool = False) -> bool:
        """
        处理单个文件
        返回: True 表示已修改，False 表示未修改
        """
        # 读取文件
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 解析 front matter
        frontmatter, original_fm_raw, body = self.parse_frontmatter(content)
        
        if frontmatter is None:
            print(f"\n⚠️  文件没有有效的 front matter: {filepath.relative_to(self.posts_dir)}")
            return False
        
        # 获取建议的缺失字段
        suggestions = self.suggest_missing_fields(frontmatter, filepath)
        
        # 如果没有需要添加的字段，跳过
        if not suggestions:
            print(f"\n✅ 文件已完整: {filepath.relative_to(self.posts_dir)}")
            return False
        
        # 合并建议
        modified_fm = frontmatter.copy()
        modified_fm.update(suggestions)
        
        # 生成新的 front matter
        new_fm_str = self.generate_frontmatter(modified_fm)
        
        # 显示对比
        self.display_comparison(original_fm_raw, new_fm_str.strip('---\n').strip(), filepath)
        
        # 显示将要添加的字段
        print("\n📝 将要添加/修改的字段:")
        for key, value in suggestions.items():
            print(f"   • {key}: {value}")
        
        # 询问是否应用更改
        if auto_mode:
            apply = True
            print("\n🤖 自动模式: 应用更改")
        else:
            while True:
                choice = input("\n是否应用更改? (y/n/s=跳过所有): ").lower().strip()
                if choice in ['y', 'n', 's']:
                    break
                print("请输入 y, n 或 s")
            
            if choice == 's':
                return 'skip_all'
            apply = choice == 'y'
        
        if apply:
            # 写入文件
            new_content = new_fm_str + body
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ 已更新: {filepath.relative_to(self.posts_dir)}")
            return True
        else:
            print(f"⏭️  已跳过: {filepath.relative_to(self.posts_dir)}")
            return False
    
    def run(self, auto_mode: bool = False):
        """运行批量处理"""
        print("\n" + "🚀 Front Matter 批量管理工具".center(80, "="))
        print("\n📂 扫描目录:", self.posts_dir.absolute())
        
        # 查找所有 markdown 文件
        md_files = self.find_markdown_files()
        print(f"📊 找到 {len(md_files)} 个 Markdown 文件\n")
        
        if not md_files:
            print("❌ 没有找到任何 Markdown 文件")
            return
        
        # 处理每个文件
        modified_count = 0
        skipped_count = 0
        
        for i, filepath in enumerate(md_files, 1):
            print(f"\n[{i}/{len(md_files)}]", end=" ")
            
            result = self.process_file(filepath, auto_mode)
            
            if result == 'skip_all':
                print("\n⏭️  跳过剩余所有文件")
                break
            elif result:
                modified_count += 1
            else:
                skipped_count += 1
        
        # 显示统计
        print("\n" + "=" * 80)
        print("📊 处理完成!")
        print(f"   ✅ 已修改: {modified_count} 个文件")
        print(f"   ⏭️  已跳过: {skipped_count} 个文件")
        print(f"   📁 总计: {len(md_files)} 个文件")
        print("=" * 80 + "\n")


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Front Matter 批量管理工具')
    parser.add_argument(
        '--dir',
        default='./posts',
        help='Markdown 文件所在目录 (默认: ./posts)'
    )
    parser.add_argument(
        '--auto',
        action='store_true',
        help='自动模式，不询问直接应用所有更改'
    )
    
    args = parser.parse_args()
    
    try:
        manager = FrontMatterManager(args.dir)
        manager.run(auto_mode=args.auto)
    except Exception as e:
        print(f"\n❌ 错误: {e}")
        return 1
    
    return 0


if __name__ == '__main__':
    exit(main())
