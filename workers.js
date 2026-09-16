const HTML_CONTENT = `
<!DOCTYPE html>
<html lang="zh-CN" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Card Tab - 我的导航</title>
    <link rel="icon" href="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20128%20128%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22grad%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%3Cstop%20offset%3D%220%25%22%20style%3D%22stop-color%3A%2310b981%3Bstop-opacity%3A1%22%20%2F%3E%3Cstop%20offset%3D%22100%25%22%20style%3D%22stop-color%3A%230d9488%3Bstop-opacity%3A1%22%20%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22128%22%20height%3D%22128%22%20rx%3D%2224%22%20fill%3D%22url%28%23grad%29%22%2F%3E%3Cpath%20d%3D%22M64%2024l12.36%2025.04L104%2054.1l-20%2020.48%204.72%2027.52L64%2088.89%2039.28%20101.1%2044%2073.58%2024%2054.1l27.64-5.06L64%2024z%22%20fill%3D%22white%22%2F%3E%3C%2Fsvg%3E">
    <script src="/tailwind.js"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        glass: {
                            border: 'rgba(255, 255, 255, 0.2)',
                            darkBorder: 'rgba(255, 255, 255, 0.1)',
                        }
                    },
                    
                    boxShadow: {
                        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
                        'glass-hover': '0 10px 40px rgba(0, 0, 0, 0.2)',
                    }
                }
            }
        }
    </script>
    <style>
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.3); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(156, 163, 175, 0.6); }

        .loading-spinner-track { border: 4px solid #e2e8f0; }
        .dark .loading-spinner-track { border-color: #334155; }
        .loading-spinner-arc { border: 4px solid transparent; border-top-color: #10b981; }
        .dark .loading-spinner-arc { border-top-color: #34d399; }
        .icon-spinner { border: 2px solid #cbd5e1; border-top-color: #10b981; }
        .dark .icon-spinner { border-color: #475569; border-top-color: #34d399; }

        @media (max-width: 640px) {
            ::-webkit-scrollbar { display: none; }
            * { scrollbar-width: none; /* Firefox */ }
        }
        
        .card.dragging {
            opacity: 0.8;
            transform: scale(1.05);
            border: 2px dashed #10b981;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            z-index: 50;
            position: relative;
        }

        .edit-mode .card {
            /* touch-action: none; */  
            touch-action: pan-y;
        }

        body.edit-mode .card,
        body.edit-mode .card:hover {
            transform: none !important;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important; 
        }
        
        html.dark body.edit-mode .card,
        html.dark body.edit-mode .card:hover {
            box-shadow: none !important;
            border-color: rgba(51, 65, 85, 0.5) !important;
        }

        .add-card-placeholder {
            pointer-events: auto !important;
            z-index: 10;
        }
        
        .card-clone-dragging {
            pointer-events: none !important; /* 关键：让触摸穿透克隆体 */
            z-index: 9999 !important;
        }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .dropdown-enter {
            animation: dropdown-in 0.2s ease-out forwards;
        }
        @keyframes dropdown-in {
            from { opacity: 0; transform: translateY(-10px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .overlay-hidden {
            opacity: 0;
            pointer-events: none;
        }
        .overlay-visible {
            opacity: 1;
            pointer-events: auto;
        }
        .dialog-scale-hidden {
            transform: scale(0.95);
            opacity: 0;
        }
        .dialog-scale-visible {
            transform: scale(1);
            opacity: 1;
        }

        .section-anchor {
            scroll-margin-top: 160px;
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
            -webkit-transition: background-color 99999s ease-out;
            -webkit-transition-delay: 99999s;
            -webkit-text-fill-color: #475569 !important; 
        }

        html.dark input:-webkit-autofill,
        html.dark input:-webkit-autofill:hover, 
        html.dark input:-webkit-autofill:focus, 
        html.dark input:-webkit-autofill:active {
            -webkit-text-fill-color: #CBD5E1 !important;
            box-shadow: 0 0 0px 1000px #1e293b inset !important;
            transition: background-color 5000s ease-in-out 0s;
        }
        
        #custom-tooltip {
            z-index: 100;
            transition: opacity 0.1s ease-in-out;
        }

        .card-status-tag {
            display: none;
            align-items: center;
            gap: 4px;
            font-size: 11px;
            font-weight: 500;
            line-height: 1.4;
            padding: 2px 8px;
            border-radius: 9999px;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.28s ease;
        }
        .card-status-tag.visible {
            display: inline-flex;
            opacity: 1;
        }
        .card-status-tag.checking {
            background: rgba(234, 179, 8, 0.15);
            color: #b45309;
        }
        html.dark .card-status-tag.checking {
            color: #fbbf24;
        }
        .card-status-tag.online {
            background: rgba(16, 185, 129, 0.15);
            color: #059669;
        }
        html.dark .card-status-tag.online {
            color: #34d399;
        }
        /* 延迟偏慢（300~1000ms）：橙色 */
        .card-status-tag.slow {
            background: rgba(249, 115, 22, 0.15);
            color: #ea580c;
        }
        html.dark .card-status-tag.slow {
            color: #fb923c;
        }
        .card-status-tag.offline {
            background: rgba(239, 68, 68, 0.15);
            color: #dc2626;
        }
        html.dark .card-status-tag.offline {
            color: #f87171;
        }
    </style>
    <script>
        (function () {
            let isDark;
            const savePreferences = localStorage.getItem('savePreferences');
            if (savePreferences === 'true') {
                const savedTheme = localStorage.getItem('theme');
                isDark = savedTheme === 'dark';
            } else {
                const hour = new Date().getHours();
                isDark = (hour >= 21 || hour < 6);
            }
            window.isDarkTheme = isDark;
            if (isDark) document.documentElement.classList.add('dark');
        })();
    </script>
</head>

<body class="min-h-screen font-sans text-slate-800 dark:text-slate-100 selection:bg-emerald-200 dark:selection:bg-emerald-900 transition-colors duration-300">
    
    <!-- 背景层 -->
    <div class="fixed inset-0 -z-10 h-full w-full overflow-hidden bg-gray-100 dark:bg-[#0f172a]">
        <div class="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#0f172a] dark:to-[#1e293b]"></div>
        <div class="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-emerald-300/30 dark:bg-indigo-600/20 rounded-full blur-[150px]"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-300/30 dark:bg-purple-600/20 rounded-full blur-[120px]"></div>
    </div>

    <!-- 顶部固定导航 -->
    <div class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div class="backdrop-blur-md bg-gray-100/80 dark:bg-[#0f172a]/85 border-b border-slate-200/40 dark:border-slate-700/40 shadow-sm [transform:translateZ(0)]">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16 gap-4">
                    
                    <!-- Logo -->
                    <a class="flex items-center gap-2 flex-shrink-0 group cursor-pointer bg-white/50 dark:bg-transparent hover:bg-white dark:hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-transparent transition-all duration-300 hover:shadow-md hover:shadow-emerald-500/10 hover:-translate-y-0.5" href="#" onclick="location.reload()">
                        <div class="w-8 h-8 flex items-center justify-center bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-lg text-white shadow-lg shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                            </svg>
                        </div>
                        <span class="font-bold text-lg tracking-wide text-slate-700 dark:text-slate-100 hidden sm:block">我的导航</span>
                    </a>

                    <!-- Search Bar -->
                    <div class="flex-1 max-w-2xl mx-auto">
                        <div class="relative flex items-center w-full h-10 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500/50 focus-within:shadow-lg focus-within:-translate-y-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-lg transition-all duration-300">
                            
                            <!-- Custom Search Engine Dropdown -->
                            <div class="relative h-full" id="search-engine-wrapper">
                                <button id="search-engine-btn" class="h-full pl-3 pr-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-l-xl transition-colors outline-none w-auto md:min-w-[5.5rem]">
                                    <!-- 默认显示本站图标 -->
                                    <span id="current-engine-icon" class="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                    </span>
                                    <span id="current-engine-label" class="font-medium truncate hidden md:block">本站</span>
                                    <svg class="w-3 h-3 opacity-60 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>
                                
                                <!-- Dropdown Menu -->
                                <div id="search-engine-menu" class="hidden absolute top-full left-0 mt-2 w-24 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 dropdown-enter">
                                    <div class="py-1" id="search-engine-list">
                                        <div class="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">搜索引擎</div>
                                        <!-- JS 自动插入按钮 -->
                                    </div>
                                </div>
                            </div>

                            <div class="h-4 w-px bg-slate-200 dark:bg-slate-600 mx-1"></div>
                            
                            <input type="text" id="search-input" class="flex-1 bg-transparent border-none text-slate-700 dark:text-slate-200 text-sm focus:ring-0 placeholder-slate-400 h-full w-full outline-none px-2" placeholder="搜索">
                            
                            <button id="clear-search-button" class="hidden p-1.5 mr-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                            </button>
                            
                            <button id="search-button" class="h-full px-4 rounded-r-xl text-slate-500 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700/50 transition-colors border-l border-transparent dark:border-slate-700/50 flex items-center justify-center">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </button>
                        </div>
                    </div>

                    <!-- Profile / Settings -->
                    <div class="relative flex items-center gap-2">
                        <div id="profile-dropdown-wrapper" class="relative">
                            <button id="profile-menu-toggle" class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-all text-sm font-medium border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm">
                                <div class="w-7 h-7 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center shadow-inner">
                                     <svg class="w-4 h-4 text-slate-500 dark:text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </div>
                                <span id="menu-toggle" class="hidden md:inline">设置</span>
                            </button>
                            
                            <!-- Dropdown Menu -->
                            <div id="profile-dropdown" class="hidden absolute right-0 mt-2 w-60 bg-white dark:bg-[#1e293b] rounded-xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden transform origin-top-right transition-all z-50 dropdown-enter">
                                <div class="p-2 space-y-1">
                                    <!-- Edit Mode -->
                                    <button id="edit-mode-btn" onclick="toggleEditMode()" class="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700/50 hover:text-emerald-600 transition-colors flex items-center gap-3 font-medium">
                                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                        编辑模式
                                    </button>

                                    <!-- 一键检测 -->
                                    <div id="check-all-menu" class="hidden border-t border-slate-100 dark:border-slate-700/50 my-1 pt-1">
                                        <button id="check-all-btn" onclick="checkAllSites()" class="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700/50 hover:text-emerald-600 transition-colors flex items-center justify-between gap-3 font-medium">
                                            <span class="flex items-center gap-3">
                                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                一键检测
                                            </span>
                                            <span id="check-all-status" class="text-xs font-normal text-slate-400 dark:text-slate-500"></span>
                                        </button>
                                    </div>

                                    <!-- 导入导出 (仅登录显示) -->
                                    <div id="data-tools-menu" class="hidden border-t border-slate-100 dark:border-slate-700/50 my-1 pt-1">
                                         <button onclick="exportData()" class="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-slate-700/50 hover:text-amber-600 transition-colors flex items-center gap-3">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                            导出配置
                                        </button>
                                        <button onclick="importData()" class="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-green-50 dark:hover:bg-slate-700/50 hover:text-green-600 transition-colors flex items-center gap-3">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12"></path></svg>
                                            导入配置
                                        </button>
                                        <!-- 文件输入框 (隐藏) -->
                                        <input type="file" id="import-file-input" accept=".json,.html,.htm" class="hidden">
                                    </div>
                                    
                                    <div class="h-px bg-slate-100 dark:bg-slate-700/50 mx-1 my-1"></div>

                                    <!-- 【新增】APP 布局切换 -->
                                    <div class="px-3 py-2.5 flex items-center justify-between text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg group">
                                        <span class="flex items-center gap-3">
                                            <svg class="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect>
                                                <rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>
                                            </svg>
                                            APP 视图
                                        </span>
                                        <label class="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" id="layout-switch-checkbox" onchange="toggleAppLayout()" class="sr-only peer">
                                            <div class="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
                                        </label>
                                    </div>
                                    
                                    <div class="px-3 py-2.5 flex items-center justify-between text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg group">
                                        <span class="flex items-center gap-3">
                                            <svg class="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                                            深色模式
                                        </span>
                                        <label class="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" id="theme-switch-checkbox" class="sr-only peer">
                                            <div class="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
                                        </label>
                                    </div>
                                    <div class="px-3 py-2.5 flex items-center justify-between text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg group">
                                        <span class="flex items-center gap-3">
                                            <svg class="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                                            记住设置
                                        </span>
                                        <label class="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" id="save-preference-checkbox" class="sr-only peer">
                                            <div class="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
                                        </label>
                                    </div>
                                    <div class="h-px bg-slate-100 dark:bg-slate-700/50 mx-1 my-1"></div>
                                    <button id="login-Btn" onclick="toggleLogin()" class="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors flex items-center gap-3 font-medium">
                                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                                        登录 / 退出
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 快捷分类栏 -->
                <div id="category-buttons-container" class="py-2 flex gap-2 overflow-x-auto no-scrollbar mask-gradient items-center">
                    <!-- JS 生成按钮 -->
                </div>
            </div>
        </div>
    </div>

    <!-- 主要内容区 -->
    <main class="pt-36 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
        <!-- 添加分类按钮 (仅编辑模式显示) -->
        <div id="add-category-container" class="hidden mt-12 mb-8">
            <button onclick="addCategory()" class="w-full py-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-emerald-500 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2 group">
                <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 flex items-center justify-center transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                </div>
                <span class="font-medium text-lg">新建分类</span>
            </button>
        </div>

        <!-- 内容渲染容器 -->
        <div id="sections-container" class="space-y-10"></div>

        <!-- 返回顶部按钮独立放置 -->
        <div class="fixed bottom-8 right-8 z-50">
            <button id="back-to-top-btn" onclick="scrollToTop()" class="hidden w-12 h-12 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 hover:bg-slate-50 dark:hover:bg-slate-700 has-tooltip group" data-tooltip="返回顶部">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
            </button>
        </div>
        
    </main>

    <!-- 模态框：添加/编辑链接 -->
    <div id="dialog-overlay" class="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 overlay-hidden">
        <div id="dialog-box" class="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 border border-slate-100 dark:border-slate-700 dialog-scale-hidden">
            <h3 class="text-xl font-bold mb-5 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span class="w-1 h-6 bg-emerald-500 rounded-full"></span>
                编辑信息
            </h3>
            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">名称 <span class="text-red-500">*</span></label>
                    <input type="text" id="name-input" class="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all dark:text-white" placeholder="网站名称">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">地址 <span class="text-red-500">*</span></label>
                    <input type="text" id="url-input" class="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all dark:text-white" placeholder="https://...">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">描述</label>
                    <input type="text" id="tips-input" class="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all dark:text-white" placeholder="简短的描述...">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">图标 URL</label>
                    <input type="text" id="icon-input" class="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all dark:text-white" placeholder="留空自动获取">
                </div>
                
                <!-- Custom Category Dropdown -->
                <div class="relative z-20" id="category-select-wrapper">
                    <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">分类</label>
                    <input type="hidden" id="category-select-value">
                    <button id="category-select-btn" class="w-full px-4 py-2.5 text-left rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all text-slate-700 dark:text-white flex items-center justify-between">
                        <span id="category-select-text">请选择分类</span>
                        <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <!-- Dropdown List -->
                    <div id="category-select-menu" class="hidden absolute top-full left-0 mt-2 w-full max-h-48 overflow-y-auto bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 custom-scrollbar">
                        <!-- Items populated by JS -->
                    </div>
                </div>

                <div class="flex items-center gap-2 pt-2">
                    <input type="checkbox" id="private-checkbox" class="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-500 border-gray-300 bg-gray-100">
                    <label for="private-checkbox" class="text-sm text-slate-600 dark:text-slate-300 font-medium">设为私密链接 (仅登录可见)</label>
                </div>
            </div>
            <div class="flex justify-end gap-3 mt-8">
                <button id="dialog-cancel-btn" class="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors">取消</button>
                <button id="dialog-confirm-btn" class="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/25 transition-all hover:translate-y-[-1px]">确定</button>
            </div>
        </div>
    </div>

    <!-- 密码弹窗 -->
    <div id="password-dialog-overlay" class="fixed inset-0 z-[70] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 overlay-hidden">
        <div id="password-dialog-box" class="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-slate-100 dark:border-slate-700 text-center transform transition-all duration-300 dialog-scale-hidden">
            <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <h3 class="text-xl font-bold mb-2 text-slate-800 dark:text-white">身份验证</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">请输入管理员密码以继续操作</p>
            <input type="password" id="password-input" placeholder="访问密码" class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none mb-6 dark:text-white text-center tracking-widest text-lg transition-all">
            <div class="flex gap-3">
                <button id="password-cancel-btn" class="flex-1 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 font-medium transition-colors">取消</button>
                <button id="password-confirm-btn" class="flex-1 py-2.5 rounded-xl text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/25 font-medium transition-colors">确认登录</button>
            </div>
        </div>
    </div>

    <!-- 自定义 Alert -->
    <div id="custom-alert-overlay" class="fixed inset-0 z-[110] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 overlay-hidden">
        <div id="custom-alert-box" class="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-slate-100 dark:border-slate-700 transform transition-all duration-300 dialog-scale-hidden">
            <h3 id="custom-alert-title" class="text-lg font-bold mb-2 text-slate-800 dark:text-white">提示</h3>
            <p id="custom-alert-content" class="text-slate-600 dark:text-slate-300 mb-6 text-sm leading-relaxed"></p>
            <div class="flex justify-end">
                <button id="custom-alert-confirm" class="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-emerald-500/20">我知道了</button>
            </div>
        </div>
    </div>

    <!-- 自定义 Confirm -->
    <div id="custom-confirm-overlay" class="fixed inset-0 z-[80] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 overlay-hidden">
        <div id="custom-confirm-box" class="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-slate-100 dark:border-slate-700 transform transition-all duration-300 dialog-scale-hidden">
            <h3 class="text-lg font-bold mb-3 text-slate-800 dark:text-white">确认操作</h3>
            <p id="custom-confirm-message" class="text-slate-600 dark:text-slate-300 mb-6 text-sm"></p>
            <div class="flex justify-end gap-3">
                <button id="custom-confirm-cancel" class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl dark:text-slate-400 dark:hover:bg-slate-700 transition-colors font-medium">取消</button>
                <button id="custom-confirm-ok" class="px-4 py-2 text-sm text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20 transition-colors font-medium">确定</button>
            </div>
        </div>
    </div>

    <!-- 分类输入弹窗 -->
    <div id="category-dialog" class="fixed inset-0 z-[65] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 overlay-hidden">
        <div id="category-dialog-box" class="bg-white dark:bg-[#1e293b] rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 dark:border-slate-700 transform transition-all duration-300 dialog-scale-hidden">
            <h3 id="category-dialog-title" class="text-lg font-bold mb-4 text-slate-800 dark:text-white">分类名称</h3>
            <input type="text" id="category-name-input" class="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none mb-6 dark:text-white transition-all" placeholder="输入分类名称">
            <div class="flex justify-end gap-3">
                <button id="category-cancel-btn" class="px-4 py-2 text-sm rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 font-medium">取消</button>
                <button id="category-confirm-btn" class="px-4 py-2 text-sm rounded-xl text-white bg-emerald-500 hover:bg-emerald-600 shadow-md font-medium">确定</button>
            </div>
        </div>
    </div>

    <div id="loading-mask" class="fixed inset-0 z-30 hidden flex flex-col items-center justify-center transition-opacity">
        <div class="relative w-16 h-16">
            <div class="absolute inset-0 w-full h-full rounded-full loading-spinner-track"></div>
            <div class="absolute inset-0 w-full h-full rounded-full loading-spinner-arc animate-spin"></div>
        </div>
        <p class="mt-4 text-emerald-600 dark:text-emerald-400 font-medium animate-pulse tracking-wide">加载中...</p>
    </div>

    <!-- Tooltip Container -->
    <div id="custom-tooltip" class="fixed hidden pointer-events-none max-w-xs whitespace-pre-wrap border leading-relaxed tracking-wide backdrop-blur-sm rounded-xl shadow-glass px-4 py-2 text-sm transition-opacity duration-150
        bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-slate-200/50 dark:border-slate-700/50">
    </div>

    <script>
    let isEditMode = false;
    let isLoggedIn = false;
    let isAppLayout = localStorage.getItem('appLayout') === 'true';

    let editCardMode = false;
    let isEditCategoryMode = false;
    
    const categories = {};
    let currentEngine;
    let initialDragState = { category: null, index: -1 };

    let latencyResults = {};
    let checkAllRunning = false;

    function siteKey(url) {
        return String(url || '')
            .replace(/^[a-z]+:\\/\\//i, '')
            .replace(/\\/+$/, '')
            .toLowerCase();
    }

    function findCardsByUrl(rawUrl) {
        const out = [];
        document.querySelectorAll('[data-url]').forEach((c) => {
            if (c.getAttribute('data-url') === rawUrl) out.push(c);
        });
        return out;
    }

    function renderStatus(card, state) {
        const tag = card.querySelector('.card-status-tag');
        if (!tag) return;
        tag.classList.remove('checking', 'online', 'slow', 'offline');
        if (state === 'checking') {
            tag.classList.add('checking', 'visible');
            tag.textContent = '检测中...';
            tag.title = '';
        } else if (state && state.online) {
            const latency = Number(state.latency) || 0;
            const isLocal = state.source === 'local';
            if (!isLocal && latency > 1000) {
                tag.classList.add('offline', 'visible');
            } else if (latency > 300) {
                tag.classList.add('slow', 'visible');
            } else {
                tag.classList.add('online', 'visible');
            }
            tag.textContent = latency + 'ms';
            tag.title = state.status != null ? ('HTTP ' + state.status + '，耗时 ' + latency + 'ms') : ('在线 ' + latency + 'ms');
        } else {
            tag.classList.add('offline', 'visible');
            tag.textContent = '离线';
            tag.title = state && state.status != null ? ('HTTP ' + state.status) : '离线或超时';
        }
    }

    async function localProbe(url) {
        const start = Date.now();
        const TIMEOUT = 3000;
        return new Promise((resolve) => {
            let settled = false;
            let overallTimer = null;
            let img = null;
            const controller = new AbortController();

            const finish = (result) => {
                if (settled) return;
                settled = true;
                if (overallTimer) { clearTimeout(overallTimer); overallTimer = null; }
                try { controller.abort(); } catch (_) {}
                if (img) {
                    img.onload = null;
                    img.onerror = null;
                    img.src = '';
                    img = null;
                }
                resolve(Object.assign({ latency: Date.now() - start }, result));
            };

            overallTimer = setTimeout(
                () => finish({ online: false, status: 'error', source: 'local' }),
                TIMEOUT + 200
            );

            fetch(url, {
                mode: 'no-cors',
                redirect: 'follow',
                cache: 'no-store',
                signal: controller.signal
            }).then(() => finish({ online: true, status: 200, source: 'local' }))
              .catch(() => {});

            try {
                img = new Image();
                img.onload = () => finish({ online: true, status: 200, source: 'local' });
                img.onerror = () => finish({ online: true, status: 200, source: 'local' });
                const cleanUrl = new URL(url).origin;
                img.src = cleanUrl + '/favicon.ico?_t=' + Date.now();
            } catch (e) {
                img = null;
            }
        });
    }

    // 一键检测：最大并发 5 的队列，检测全部站点
    async function checkAllSites() {
        if (!isLoggedIn) { alert('请先登录后再使用检测功能'); return; }
        if (checkAllRunning) return;
        if (!await customConfirm('确定要检测全部站点的存活与延迟吗？')) return;
        checkAllRunning = true;

        const statusEl = document.getElementById('check-all-status');
        if (statusEl) statusEl.textContent = '检测中...';

        const links = getAllLinks().filter((l) => l && l.url);
        const total = links.length;

        if (total === 0) {
            checkAllRunning = false;
            if (statusEl) statusEl.textContent = '0 个站点';
            return;
        }

        const allCards = document.querySelectorAll('[data-url]');
        allCards.forEach((c) => renderStatus(c, 'checking'));

        links.forEach((l) => { latencyResults[siteKey(l.url)] = 'checking'; });

        const queue = links.slice();
        let doneCount = 0;

        let lastProgressUpdate = 0;
        function updateProgress() {
            if (!statusEl) return;
            const now = Date.now();
            // 限制进度文本每 100ms 最多刷新一次，或者全部完成时强制刷新
            if (now - lastProgressUpdate > 100 || doneCount === total) {
                statusEl.textContent = doneCount + '/' + total;
                lastProgressUpdate = now;
            }
        }

        async function worker() {
            while (queue.length > 0) {
                const link = queue.shift();
                if (!link) continue;             
                const key = siteKey(link.url);                
                const cards = findCardsByUrl(link.url);
                const result = await localProbe(link.url);              
                latencyResults[key] = result;               
                if (cards.length > 0) {
                    cards.forEach((c) => renderStatus(c, result));
                }                
                doneCount++;
                updateProgress(); 
            }
        }

        const tasks = [];
        const concurrency = Math.min(5, queue.length);
        for (let i = 0; i < concurrency; i++) {
            tasks.push(worker());
        }
        
        await Promise.all(tasks);

        checkAllRunning = false;
        if (statusEl) statusEl.textContent = '';
    }

    function toggleAppLayout() {
        isAppLayout = !isAppLayout;
        localStorage.setItem('appLayout', isAppLayout);
        
        const checkbox = document.getElementById('layout-switch-checkbox');
        if (checkbox) checkbox.checked = isAppLayout;

        loadSections();
    }

    function logAction(action, details) {
        console.log(\`\${new Date().toISOString()}: \${action} - \`, details);
    }

    // 搜索引擎
    const searchEngines = {
        baidu: "https://www.baidu.com/s?wd=",
        bing: "https://www.bing.com/search?q=",
        google: "https://www.google.com/search?q=",
        site: ""
    };
    
    // 搜索引擎显示名称映射
    const searchEngineLabels = {
        baidu: "百度",
        bing: "必应",
        google: "谷歌",
        site: "本站"
    };

    // 搜索引擎图标映射 (SVG路径)
    const searchEngineIcons = {
        site:   '<svg width="16" height="16" fill="#FFD700" stroke="#FFD700" viewBox="0 0 24 24"><path fill="#FFD700" stroke="#FFD700" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>',
        baidu:  '<svg width="16" height="16" viewBox="0 0 32 32"><path fill="#4285F4" d="M5.749 16.864c3.48-.744 3-4.911 2.901-5.817c-.172-1.401-1.823-3.853-4.057-3.656c-2.812.249-3.224 4.323-3.224 4.323c-.385 1.88.907 5.901 4.38 5.151zm6.459-6.984c1.923 0 3.475-2.213 3.475-4.948C15.683 2.213 14.136 0 12.214 0c-1.916 0-3.479 2.197-3.479 4.932s1.557 4.948 3.479 4.948zm8.281.328c2.573.344 4.213-2.401 4.547-4.479c.333-2.068-1.333-4.484-3.145-4.896c-1.823-.421-4.079 2.5-4.307 4.401c-.24 2.333.333 4.651 2.895 4.979zm10.178 3.505c0-.995-.817-3.995-3.88-3.995c-3.057 0-3.48 2.828-3.48 4.828c0 1.907.157 4.563 3.98 4.48c3.807-.095 3.391-4.319 3.391-5.319zm-3.864 8.714s-3.985-3.077-6.303-6.4c-3.145-4.901-7.62-2.907-9.115-.423c-1.489 2.511-3.812 4.084-4.14 4.505c-.333.412-4.797 2.823-3.803 7.224c1 4.401 4.479 4.323 4.479 4.323s2.557.251 5.548-.416c2.984-.667 5.547.161 5.547.161s6.943 2.333 8.864-2.147c1.896-4.495-1.083-6.812-1.083-6.812z"/></svg>',
        bing:   '<svg width="16" height="16" viewBox="0 0 32 32"><path fill="#008373" d="m4.807 0l6.391 2.25v22.495l9.005-5.193l-4.411-2.073l-2.786-6.932l14.188 4.984v7.245L11.204 32l-6.396-3.563z"/></svg>',
        google: '<svg width="16" height="16" viewBox="0 0 256 262"><path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"/><path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"/><path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"/><path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"/></svg>'
    };

    const engineList = ['site', 'baidu', 'bing', 'google'];

    function renderSearchEngineMenu() {
        const container = document.getElementById('search-engine-list');
        const title = container.querySelector('div');
        container.innerHTML = '';
        container.appendChild(title);

        engineList.forEach(key => {
            const label = searchEngineLabels[key];
            const icon = searchEngineIcons[key];
            
            const btn = document.createElement('button');
            btn.className = "w-full text-left px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-600 transition-colors flex items-center gap-3";
            btn.onclick = () => selectSearchEngine(key, label);
            
            btn.innerHTML = \`\${icon}<span>\${label}</span>\`;
            
            container.appendChild(btn);
        });
    }

    function setActiveEngine(engine) {
        if (!searchEngines.hasOwnProperty(engine) && engine !== 'site') engine = 'site';
        selectSearchEngine(engine, searchEngineLabels[engine]);
    }

    function updateSearchEngineUI(value) {
        const label = searchEngineLabels[value] || "本站";
        const icon = searchEngineIcons[value] || searchEngineIcons['site'];
        
        document.getElementById('current-engine-label').textContent = label;
        document.getElementById('current-engine-icon').innerHTML = icon;
    }

    document.addEventListener('DOMContentLoaded', async () => {
        const loadingMask = document.getElementById('loading-mask');
        if (loadingMask) loadingMask.classList.remove('hidden');
        initializeUIComponents();
        renderSearchEngineMenu();
        await checkLoginStatusAndLoad();
        if (loadingMask) loadingMask.classList.add('hidden');
        document.addEventListener('visibilitychange', async () => {
            if (document.visibilityState === 'visible' && isLoggedIn) {
                await validateToken();
            }
        });
    });

    async function checkLoginStatusAndLoad() {
        const isValid = await validateToken();
        if (isValid) {
            isLoggedIn = true;
        } else {
            isLoggedIn = false;
            isEditMode = false;
        }
        await loadLinks();
    }

    function initializeUIComponents() {
        const elements = {
            themeSwitchCheckbox: document.getElementById('theme-switch-checkbox'),
            layoutSwitchCheckbox: document.getElementById('layout-switch-checkbox'),
            savePrefCheckbox: document.getElementById('save-preference-checkbox'),
            searchButton: document.getElementById('search-button'),
            searchInput: document.getElementById('search-input'),
            clearSearchButton: document.getElementById('clear-search-button'),
            menuToggleBtn: document.getElementById('profile-menu-toggle'),
            dropdown: document.getElementById('profile-dropdown'),
            dropdownWrapper: document.getElementById('profile-dropdown-wrapper'),
            backToTopBtn: document.getElementById('back-to-top-btn')
        };
        
        elements.themeSwitchCheckbox.checked = document.documentElement.classList.contains('dark');
        elements.themeSwitchCheckbox.addEventListener('change', (e) => {
            const isDark = e.target.checked;
            window.isDarkTheme = isDark;
            applyTheme(isDark);
            
            const savePrefCheckbox = document.getElementById('save-preference-checkbox');
            if (savePrefCheckbox && savePrefCheckbox.checked) {
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            }
        });

        if(elements.layoutSwitchCheckbox) {
            elements.layoutSwitchCheckbox.checked = isAppLayout;
        }
        
        const savedPref = localStorage.getItem('savePreferences') === 'true';
        elements.savePrefCheckbox.checked = savedPref;

        currentEngine = (savedPref && localStorage.getItem('searchEngine')) || 'site';
        updateSearchEngineUI(currentEngine);

        const searchWrapper = document.getElementById('search-engine-wrapper');
        const searchBtn = document.getElementById('search-engine-btn');
        const searchMenu = document.getElementById('search-engine-menu');
        
        searchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            searchMenu.classList.toggle('hidden');
        });

        const catWrapper = document.getElementById('category-select-wrapper');
        const catBtn = document.getElementById('category-select-btn');
        const catMenu = document.getElementById('category-select-menu');
        
        catBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            catMenu.classList.toggle('hidden');
        });

        const toggleDropdown = () => {
            elements.dropdown.classList.toggle('hidden');
        };

        elements.menuToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown();
        });

        document.addEventListener('click', (e) => {
            if (!elements.dropdownWrapper.contains(e.target)) {
                 elements.dropdown.classList.add('hidden');
            }
            if (!searchWrapper.contains(e.target)) {
                searchMenu.classList.add('hidden');
            }
            if (!catWrapper.contains(e.target)) {
                catMenu.classList.add('hidden');
            }
        });

        elements.dropdown.addEventListener('click', (e) => { e.stopPropagation(); });

        elements.savePrefCheckbox.addEventListener('change', () => {
            const enabled = elements.savePrefCheckbox.checked;
            localStorage.setItem('savePreferences', enabled);
            if (!enabled) {
                localStorage.removeItem('searchEngine');
                localStorage.removeItem('theme');
            } else {
                localStorage.setItem('searchEngine', currentEngine);
                localStorage.setItem('theme', window.isDarkTheme ? 'dark' : 'light');
            }
        });

        elements.searchButton.addEventListener('click', async () => {
            const query = elements.searchInput.value.trim();
            if (query) {
                if (currentEngine === 'site') {
                    await searchLinks(query); 
                } else {
                    window.open(searchEngines[currentEngine] + encodeURIComponent(query), '_blank');
                }
            }
        });

        if (elements.clearSearchButton) {
            elements.clearSearchButton.addEventListener('click', () => {
                elements.searchInput.value = '';
                loadSections(); 
            });
        }

        if (elements.searchInput) {
            elements.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') elements.searchButton.click();
            });
            // 实时搜索防抖：避免每次输入都触发全量重渲染
            let searchDebounceTimer = null;
            elements.searchInput.addEventListener('input', (e) => {
                if (e.target.value) {
                    elements.clearSearchButton.classList.remove('hidden');
                } else {
                    elements.clearSearchButton.classList.add('hidden');
                }
                clearTimeout(searchDebounceTimer);
                searchDebounceTimer = setTimeout(() => {
                    const q = e.target.value.trim();
                    if (!q) {
                        // 清空关键词时恢复全量展示（不清输入框）
                        renderCategorySections({ renderButtons: true });
                        return;
                    }
                    if (currentEngine === 'site') {
                        elements.clearSearchButton.classList.remove('hidden');
                        const filtered = getFilteredCategoriesByKeyword(q);
                        // 实时搜索直接渲染，避免每次无结果都弹 alert，干扰连续输入
                        renderCategorySections({ renderButtons: true, searchMode: true, filteredCategories: filtered });
                    }
                }, 220);
            });
        }
        
        window.addEventListener('scroll', () => {
            elements.backToTopBtn.classList.toggle('hidden', window.scrollY <= 300);
        }, { passive: true });
        
        setupScrollSpy();
        
        setupTooltipDelegation();
    }

    function selectSearchEngine(value, label) {
        currentEngine = value;
        updateSearchEngineUI(value);
        
        const savePrefCheckbox = document.getElementById('save-preference-checkbox');
        if (savePrefCheckbox && savePrefCheckbox.checked) {
            localStorage.setItem('searchEngine', value);
        }
        document.getElementById('search-engine-menu').classList.add('hidden');
    }


    function getAllLinks() {
        return Object.values(categories).map(category => category.links || []).flat();
    }
    
    async function loadLinks() {
        if (isLoggedIn) {
            const isValid = await validateToken();
            if (!isValid) {
                logout();
                return;
            }
        }
        const headers = { 'Content-Type': 'application/json' };
        if (isLoggedIn) {
            const token = localStorage.getItem('authToken');
            if (token) headers['Authorization'] = token;
        }
        
        try {
            const response = await fetchWithAuth('/api/getLinks');
            if (!response.ok) throw new Error("HTTP error! status: " + response.status);
            
            const data = await response.json();
            if (data.categories) {
                Object.keys(categories).forEach(key => delete categories[key]);
                Object.assign(categories, data.categories);
            }

            loadSections();
            updateCategorySelect();
            updateUIState();
        } catch (error) {
            console.error('Error loading links:', error);
            await customAlert('加载链接时出错，请刷新页面重试');
        }
    }

    async function saveDataToServer(actionName, data) {
        try {
            const response = await fetchWithAuth('/api/saveData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ categories: data }),
            });

            if (response.status === 401) {
                logout();
                await customAlert('登录凭证已过期，请重新登录');
                throw new Error('Unauthorized');
            }

            const result = await response.json();
            if (!result.success) throw new Error('Failed to save');
            logAction(actionName + '成功', {});
        } catch (error) {
            logAction(actionName + '失败', { error: error.message });
            if (error.message !== 'Unauthorized') {
                 await customAlert(actionName + '失败，请重试');
            }
        }
    }

    async function saveLinks() {
        if (isEditMode) {
            await saveDataToServer('保存数据', categories);
        }
    }
    
    async function addCategory() {
        if (!await validateTokenOrRedirect()) return;
        const categoryName = await showCategoryDialog('请输入新分类名称');
        if (!categoryName) return;
        if (categories[categoryName]) {
            await customAlert('该分类已存在');
            return;
        }
        categories[categoryName] = { isHidden: false, isPrivate: false, links: [] };
        updateCategorySelect();
        renderCategories();
        setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);
        await saveLinks();
    }

    async function editCategoryName(oldName) {
        if (!await validateTokenOrRedirect()) return;
        const newName = await showCategoryDialog('请输入新的分类名称', oldName);
        if (!newName || newName === oldName) return;
        if (categories[newName]) {
            await customAlert('该名称已存在');
            return;
        }

        const keys = Object.keys(categories);
        const newCategories = {};

        keys.forEach(key => {
            if (key === oldName) {
                const data = categories[oldName];
                data.links.forEach(item => item.category = newName);
                newCategories[newName] = data;
            } else {
                newCategories[key] = categories[key];
            }
        });

        Object.keys(categories).forEach(k => delete categories[k]);
        Object.assign(categories, newCategories);

        renderCategories();
        renderCategoryButtons();
        updateCategorySelect();
        await saveLinks();
    }

    async function deleteCategory(category) {
        if (!await validateTokenOrRedirect()) return;
        if (await customConfirm(\`确定删除 "\${category}" 分类及其所有链接吗？\`)) {
            delete categories[category];
            updateCategorySelect();
            renderCategories();
            renderCategoryButtons();
            await saveLinks();
        }
    } 
    
    async function moveCategory(categoryName, direction) {
        if (!await validateTokenOrRedirect()) return;
        const keys = Object.keys(categories);
        const index = keys.indexOf(categoryName);
        if (index < 0) return;
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= keys.length) return;
    
        const newCategories = {};
        const reordered = [...keys];
        [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
        reordered.forEach(key => newCategories[key] = categories[key]);
        
        Object.keys(categories).forEach(k => delete categories[k]);
        Object.assign(categories, newCategories);
    
        renderCategories();
        renderCategoryButtons();
        await saveLinks(); 
    }

    async function toggleCategoryHidden(category, isHidden) {
        if (!await validateTokenOrRedirect()) return;
        categories[category].isHidden = isHidden;
        await saveLinks();
    }

    async function toggleCategoryPrivate(category, isPrivate) {
        if (!await validateTokenOrRedirect()) return;
        categories[category].isPrivate = isPrivate;
        (categories[category].links || []).forEach(l => { l.isPrivate = isPrivate; });
        renderCategories();
        renderCategoryButtons();
        await saveLinks();
    }

    async function pinCategory(categoryName) {
        if (!await validateTokenOrRedirect()) return;
        const keys = Object.keys(categories);
        const index = keys.indexOf(categoryName);
        if (index < 0) return;
        
        const newCategories = {};
        const reordered = [...keys];
        reordered.splice(index, 1);
        reordered.unshift(categoryName);
        reordered.forEach(key => newCategories[key] = categories[key]);
        
        Object.keys(categories).forEach(k => delete categories[k]);
        Object.assign(categories, newCategories);
        
        renderCategories();
        renderCategoryButtons();
        await saveLinks();
    }
    
    function getFilteredCategoriesByKeyword(query) {
        const lowerQuery = query.toLowerCase();
        const result = {};
        Object.keys(categories).forEach(category => {
            const categoryData = categories[category];
            const matchedLinks = (categoryData.links || []).filter(link => {
                const nameMatch = link.name && link.name.toLowerCase().includes(lowerQuery);
                const tipsMatch = link.tips && link.tips.toLowerCase().includes(lowerQuery);
                const urlMatch = link.url && link.url.toLowerCase().includes(lowerQuery);
                return nameMatch || tipsMatch || urlMatch;
            });
            if (matchedLinks.length > 0) {
                result[category] = { ...categoryData, links: matchedLinks };
            }
        });
        return result;
    }

    function renderCategorySections({ renderButtons = false, searchMode = false, filteredCategories = null } = {}) {
        const container = document.getElementById('sections-container');
        setupCardDelegation(container);
        const fragment = document.createDocumentFragment();
        const sourceCategories = searchMode && filteredCategories ? filteredCategories : categories;

        Object.entries(sourceCategories).forEach(([category, { links, isHidden, isPrivate }]) => {
            if (!isEditMode && !isLoggedIn && (isHidden || isPrivate) && !searchMode) return;

            const section = document.createElement('div');
            section.className = 'section section-anchor';
            section.id = category;

            // 标题区域
            const titleContainer = document.createElement('div');
            titleContainer.className = 'flex items-center gap-3 mb-5 pb-2 border-b border-slate-200/60 dark:border-slate-700/60';
            
            const title = document.createElement('h2');
            title.className = 'text-lg font-bold text-slate-700 dark:text-slate-100 flex items-center gap-2';
            title.innerHTML = \`<span class="w-1.5 h-5 bg-emerald-500 rounded-full inline-block shadow-sm"></span> \${category}\`;
            titleContainer.appendChild(title);

            // 编辑模式下的标题栏操作
            if (isEditMode) {
                const controls = document.createElement('div');
                controls.className = 'flex items-center gap-1 ml-auto bg-slate-300/50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-300/50 dark:border-slate-700/50 backdrop-blur-sm';
                const btnBase = "w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-105 active:scale-95";
                
                controls.innerHTML = \`
                    <!-- 编辑名称 -->
                    <button class="\${btnBase} text-slate-500 hover:text-blue-600 hover:bg-blue-100 dark:text-slate-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 has-tooltip" data-tooltip="重命名" data-action="edit" data-category="\${escAttr(category)}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    
                    <div class="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-0.5"></div>

                    <!-- 排序组 -->
                    <button class="\${btnBase} text-slate-500 hover:text-emerald-600 hover:bg-emerald-100 dark:text-slate-400 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 has-tooltip" data-tooltip="上移" data-action="move" data-dir="-1" data-category="\${escAttr(category)}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
                    </button>
                    <button class="\${btnBase} text-slate-500 hover:text-emerald-600 hover:bg-emerald-100 dark:text-slate-400 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 has-tooltip" data-tooltip="下移" data-action="move" data-dir="1" data-category="\${escAttr(category)}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <button class="\${btnBase} text-slate-500 hover:text-amber-600 hover:bg-amber-100 dark:text-slate-400 dark:hover:bg-amber-900/30 dark:hover:text-amber-400 has-tooltip" data-tooltip="置顶" data-action="pin" data-category="\${escAttr(category)}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3h14M18 13l-6-6l-6 6M12 7v14"></path></svg>
                    </button>

                    <div class="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-0.5"></div>

                    <!-- 隐藏开关 -->
                    <div class="flex items-center justify-center w-8 h-8 has-tooltip cursor-pointer" data-tooltip="\${isHidden ? '显示分类' : '隐藏分类'}">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <!-- 下面这一行增加了 DOM 属性更新逻辑 -->
                            <input type="checkbox" data-action="toggleHidden" data-category="\${escAttr(category)}" \${isHidden ? 'checked' : ''} 
                                class="sr-only peer">
                            <div class="w-3.5 h-3.5 rounded-full border-2 border-slate-400 peer-focus:outline-none peer dark:border-slate-500 peer-checked:bg-slate-500 peer-checked:border-slate-500 transition-colors"></div>
                        </label>
                    </div>

                    <!-- 私密开关 -->
                    <div class="flex items-center justify-center w-8 h-8 has-tooltip cursor-pointer" data-tooltip="\${isPrivate ? '设为公开分类' : '设为私密分类'}">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" data-action="togglePrivate" data-category="\${escAttr(category)}" \${isPrivate ? 'checked' : ''} 
                                class="sr-only peer">
                            <div class="w-3.5 h-3.5 rounded-full border-2 border-amber-400 peer-focus:outline-none peer dark:border-amber-500 peer-checked:bg-amber-400 peer-checked:border-amber-400 transition-colors"></div>
                        </label>
                    </div>

                    <div class="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-0.5"></div>

                    <!-- 删除 -->
                    <button class="\${btnBase} text-slate-400 hover:text-red-600 hover:bg-red-100 dark:text-slate-500 dark:hover:bg-red-900/30 dark:hover:text-red-400 has-tooltip" data-tooltip="删除分类" data-action="delete" data-category="\${escAttr(category)}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                \`;
                titleContainer.appendChild(controls);
            }

            // 卡片网格
            const cardContainer = document.createElement('div');
            // 根据布局模式调整 Grid 列数
            // APP 模式下，手机端一行4个，平板6个，大屏8-10个
            const gridClasses = isAppLayout 
                ? 'grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-x-2 gap-y-6' 
                : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4';
            
            cardContainer.className = \`grid \${gridClasses} card-container relative\`;
            cardContainer.id = 'grid-' + category; // 与 section.id 区分，避免同页面 id 重复

            // 卡片离屏构建后一次性挂载，减少 reflow
            const cardsFragment = document.createDocumentFragment();
            links.forEach(link => {
                const card = createCard(link);
                if (card) cardsFragment.appendChild(card);
            });
            cardContainer.appendChild(cardsFragment);

            section.appendChild(titleContainer);
            section.appendChild(cardContainer);
            fragment.appendChild(section);

            if (isEditMode) {
                const addCardPlaceholder = document.createElement('div');
                const sizeClasses = isAppLayout 
                    ? 'w-16 h-16 rounded-[1.2rem] mx-auto' 
                    : 'min-h-[100px] p-4 rounded-2xl w-full';
                
                addCardPlaceholder.className = \`add-card-placeholder group flex flex-col h-full w-full \${sizeClasses} rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all cursor-pointer flex items-center justify-center\`;
                addCardPlaceholder.innerHTML = \`
                    <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 flex items-center justify-center transition-colors pointer-events-none">
                        <svg class="w-6 h-6 text-slate-400 group-hover:text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    </div>
                \`;
                
                addCardPlaceholder.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    if (draggedCard && draggedCard.parentElement === cardContainer) {
                        cardContainer.insertBefore(draggedCard, addCardPlaceholder);
                    }
                });
                
                addCardPlaceholder.onclick = () => {
                     showAddDialog();
                     document.getElementById('category-select-value').value = category;
                     document.getElementById('category-select-text').textContent = category;
                };
                cardContainer.appendChild(addCardPlaceholder);
            }
        });

        container.replaceChildren(fragment);

        if (renderButtons) renderCategoryButtons();
        
        setupScrollSpy();
    }

    function renderCategories() {
        renderCategorySections({ renderButtons: false });
    } 

    async function searchLinks(query) {
        const clearBtn = document.getElementById('clear-search-button');
        const filteredData = getFilteredCategoriesByKeyword(query);
        const hasMatchingLinks = Object.values(filteredData).some(c => c.links.length > 0);

        if (!hasMatchingLinks) {
            await customAlert('没有找到相关站点。');
            return;
        }
        clearBtn.classList.remove('hidden');
        renderCategorySections({ renderButtons: true, searchMode: true, filteredCategories: filteredData });
    }
    
    function renderCategoryButtons() {
        const container = document.getElementById('category-buttons-container');
        container.innerHTML = '';
        const visibleCategories = Object.keys(categories).filter(c => 
            (categories[c].links || []).some(l => !l.isPrivate || isLoggedIn) && 
            (!categories[c].isHidden || isEditMode || isLoggedIn) &&
            (!categories[c].isPrivate || isLoggedIn)
        );

        if (visibleCategories.length === 0) return;

        visibleCategories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'category-button whitespace-nowrap px-4 py-1.5 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-600 transition-all active:scale-95 shadow-sm scroll-snap-align-start';
            btn.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300', 'hover:bg-emerald-50', 'hover:text-emerald-600', 'dark:hover:bg-slate-700', 'hover:border-emerald-300', 'dark:hover:border-emerald-500/50');
            
            btn.textContent = cat;
            btn.dataset.target = cat;
            btn.onclick = () => {
                scrollToCategory(cat);
            };
            container.appendChild(btn);
        });

        if (!isTouchDevice()) {
            setupDragScroll(container);
        }
    }

    function isTouchDevice() {
        return window.matchMedia('(hover: none)').matches || ('ontouchstart' in window);
    }

    // 分类按钮容器超出宽度后支持鼠标拖动横向滚动
    function setupDragScroll(container) {
        if (!container || container._dragScroll) return;
        container._dragScroll = true;

        let isDown = false;
        let moved = false;
        let captured = false;
        let startX = 0;
        let startScroll = 0;
        let lastX = 0;
        let lastT = 0;
        let vx = 0;
        let inertiaId = null;

        function stopInertia() {
            if (inertiaId !== null) {
                cancelAnimationFrame(inertiaId);
                inertiaId = null;
            }
            vx = 0;
        }

        function inertiaLoop() {
            container.scrollLeft += vx * 16;
            vx *= 0.95;
            if (Math.abs(vx) < 0.08) {
                stopInertia();
                return;
            }
            inertiaId = requestAnimationFrame(inertiaLoop);
        }

        container.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return;
            stopInertia();
            isDown = true;
            moved = false;
            captured = false;
            startX = e.clientX;
            startScroll = container.scrollLeft;
            lastX = e.clientX;
            lastT = performance.now();
            container.style.userSelect = 'none';
            container.style.scrollSnapType = 'none';
            e.preventDefault();
        });

        container.addEventListener('pointermove', (e) => {
            if (!isDown) return;
            const dx = e.clientX - startX;
            const now = performance.now();
            if (Math.abs(dx) > 4) {
                if (!captured) {
                    captured = true;
                    try { container.setPointerCapture(e.pointerId); } catch (_) {}
                }
                moved = true;
                container.scrollLeft = startScroll - dx;
                const dt = (now - lastT) || 16;
                const inst = -(e.clientX - lastX) / dt;
                vx = vx * 0.8 + inst * 0.2;
                lastX = e.clientX;
                lastT = now;
            }
        });

        const endDrag = (e) => {
            if (!isDown) return;
            isDown = false;
            container.style.userSelect = '';
            container.style.scrollSnapType = '';
            if (captured) { try { container.releasePointerCapture(e.pointerId); } catch (_) {} }
            // 拖拽超过阈值时阻止本次点击误触分类按钮
            if (moved) {
                container.addEventListener('click', (ce) => {
                    ce.stopPropagation();
                    ce.preventDefault();
                }, { capture: true, once: true });
                // 惯性滚动
                if (Math.abs(vx) > 0.25) {
                    inertiaId = requestAnimationFrame(inertiaLoop);
                }
            }
        };
        container.addEventListener('pointerup', endDrag);
        container.addEventListener('pointercancel', endDrag);
    }

    function scrollToCategory(catId) {
        const section = document.getElementById(catId);
        if(section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function setupScrollSpy() {
        const sections = document.querySelectorAll('.section');
        const buttons = document.querySelectorAll('.category-button');
        
        if (!sections.length || !buttons.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '-100px 0px -70% 0px', 
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    highlightButton(id);
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    function highlightButton(id) {
        const buttons = document.querySelectorAll('.category-button');
        buttons.forEach(btn => {
            if (btn.dataset.target === id) {
                btn.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300', 'hover:bg-emerald-50', 'hover:text-emerald-600', 'dark:hover:bg-slate-700');
                btn.classList.add('bg-emerald-500', 'text-white', 'shadow-md', 'dark:bg-emerald-600');
                btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                btn.classList.remove('bg-emerald-500', 'text-white', 'shadow-md', 'dark:bg-emerald-600');
                btn.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300', 'hover:bg-emerald-50', 'hover:text-emerald-600', 'dark:hover:bg-slate-700');
            }
        });
    }

    // --- 遮罩层过渡辅助函数 ---
    function toggleOverlay(id, show) {
        const overlay = document.getElementById(id);
        const box = overlay.querySelector('div[id$="-box"]'); 
        
        if (show) {
            overlay.classList.remove('hidden');
            void overlay.offsetWidth; 
            overlay.classList.remove('overlay-hidden');
            overlay.classList.add('overlay-visible');
            
            if(box) {
                box.classList.remove('dialog-scale-hidden');
                box.classList.add('dialog-scale-visible');
            }
        } else {
            overlay.classList.remove('overlay-visible');
            overlay.classList.add('overlay-hidden');
            
            if(box) {
                box.classList.remove('dialog-scale-visible');
                box.classList.add('dialog-scale-hidden');
            }
            
            setTimeout(() => {
                if(overlay.classList.contains('overlay-hidden')) {
                    overlay.classList.add('hidden');
                }
            }, 300); 
        }
    }

    function updateUIState() {
        const editModeBtn = document.getElementById('edit-mode-btn');
        const loginBtn = document.getElementById('login-Btn');
        const addCategoryContainer = document.getElementById('add-category-container');
        const dataToolsMenu = document.getElementById('data-tools-menu');
        const checkAllMenu = document.getElementById('check-all-menu');
        
        loginBtn.innerHTML = isLoggedIn ? 
            '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg> 退出登录' : 
            '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg> 登录';
        
        if(isLoggedIn) {
            loginBtn.classList.replace('text-red-500', 'text-slate-700');
            if(dataToolsMenu) dataToolsMenu.classList.remove('hidden');
            if(checkAllMenu) checkAllMenu.classList.remove('hidden');
        } else {
            if(dataToolsMenu) dataToolsMenu.classList.add('hidden');
            if(checkAllMenu) checkAllMenu.classList.add('hidden');
        }
        
        if (isEditMode) {
            editModeBtn.innerHTML = '<span class="text-red-500 flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>退出编辑</span>';
            document.body.classList.add('edit-mode');
            if(addCategoryContainer) addCategoryContainer.classList.remove('hidden');
        } else {
            editModeBtn.innerHTML = isLoggedIn ? 
                '<span class="flex items-center gap-3"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>进入编辑模式</span>' : 
                '<span class="flex items-center gap-3 text-slate-400"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>编辑模式 (需登录)</span>';
            document.body.classList.remove('edit-mode');
            if(addCategoryContainer) addCategoryContainer.classList.add('hidden');
        }
    }
    
    function loadSections() {
        document.getElementById('clear-search-button').classList.add('hidden');
        document.getElementById('search-input').value = '';
        renderCategorySections({ renderButtons: true });
    }

    const imgApi = '/api/icon?url='; 
    const iconCache = new Map();
    const iconFailed = new Set();

    function createIconFallback(refEl) {
        const box = document.createElement('div');
        box.className = refEl.className
            .replace('opacity-0', 'opacity-100')
            .replace('object-contain', '') + ' text-slate-500 dark:text-slate-300';
        box.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="display:block;width:100%;height:100%"><path fill="currentColor" d="M16 .396c-8.839 0-16 7.167-16 16c0 7.073 4.584 13.068 10.937 15.183c.803.151 1.093-.344 1.093-.772c0-.38-.009-1.385-.015-2.719c-4.453.964-5.391-2.151-5.391-2.151c-.729-1.844-1.781-2.339-1.781-2.339c-1.448-.989.115-.968.115-.968c1.604.109 2.448 1.645 2.448 1.645c1.427 2.448 3.744 1.74 4.661 1.328c.14-1.031.557-1.74 1.011-2.135c-3.552-.401-7.287-1.776-7.287-7.907c0-1.751.62-3.177 1.645-4.297c-.177-.401-.719-2.031.141-4.235c0 0 1.339-.427 4.4 1.641a15.4 15.4 0 0 1 4-.541c1.36.009 2.719.187 4 .541c3.043-2.068 4.381-1.641 4.381-1.641c.859 2.204.317 3.833.161 4.235c1.015 1.12 1.635 2.547 1.635 4.297c0 6.145-3.74 7.5-7.296 7.891c.556.479 1.077 1.464 1.077 2.959c0 2.14-.02 3.864-.02 4.385c0 .416.28.916 1.104.755c6.4-2.093 10.979-8.093 10.979-15.156c0-8.833-7.161-16-16-16z"/></svg>';
        return box;
    }

    // HTML 属性转义：防止用户数据中的引号破坏模板属性（配合 data-* 委托使用）
    function escAttr(v) {
        return String(v).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    function createCard(link) {
        if (!isEditMode && link.isPrivate && !isLoggedIn) return null;

        const card = document.createElement('div');
        
        let cardBaseClass = isAppLayout 
            ? 'flex flex-col items-center justify-start py-1 gap-1.5 hover:z-10' 
            : 'flex flex-col p-4 bg-white/90 dark:bg-[#1e293b]/60 backdrop-blur-sm bg-white/80 border border-gray-200 dark:border-slate-700/50 hover:border-emerald-500/50 dark:hover:border-emerald-400/50 shadow-sm hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] dark:shadow-none dark:hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.4)] hover:-translate-y-1.5';
            
        if (link.isPrivate && !isAppLayout) {
            cardBaseClass += ' ring-1 ring-amber-400/40 bg-amber-50/80 dark:bg-amber-900/10 !border-amber-200 dark:!border-amber-700/50';
        }

        card.className = \`group relative h-full w-full rounded-2xl transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] cursor-pointer select-none \${cardBaseClass}\`;
        
        if (isEditMode) {
            card.setAttribute('draggable', 'true');
            card.classList.add('card'); 
            card.classList.add('cursor-move');
        }
        
        card.dataset.isPrivate = link.isPrivate;
        card.setAttribute('data-url', link.url);

        const header = document.createElement('div');
        header.className = isAppLayout 
            ? 'flex flex-col items-center justify-center w-full relative' 
            : 'flex items-center gap-3 mb-2.5 w-full';
        
        // 图标占位容器：图标加载完成前显示 spinner
        const iconWrap = document.createElement('div');
        const iconWrapClass = isAppLayout
            ? 'relative w-14 h-14 sm:w-16 sm:h-16'
            : 'relative w-9 h-9';
        iconWrap.className = iconWrapClass;

        // 加载中的 spinner（居中，位于图标底层）
        const spinner = document.createElement('span');
        spinner.className = 'absolute inset-0 flex items-center justify-center pointer-events-none';
        spinner.innerHTML = '<span class="block icon-spinner rounded-full animate-spin" style="width:60%;height:60%;aspect-ratio:1/1;"></span>';

        const icon = document.createElement('img');
        icon.setAttribute('loading', 'lazy'); 
        icon.setAttribute('decoding', 'async'); 
        icon.setAttribute('width', isAppLayout ? 64 : 36); 
        icon.setAttribute('height', isAppLayout ? 64 : 36);
        
        // 图标样式
        let iconClass = 'relative w-full h-full opacity-0 transition duration-300';
        if (isAppLayout) {
             // APP 风格：大图标、白底、大圆角、阴影
             iconClass += ' rounded-[1.2rem] object-contain bg-slate-100 dark:bg-slate-600 p-2 shadow-md hover:shadow-lg group-hover:scale-105 group-active:scale-95 z-10';
             if (link.isPrivate) {
                 iconClass += ' ring-2 ring-amber-400';
             }
        } else {
             // 列表风格：小图标、淡底
             iconClass += ' rounded-lg object-contain bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-700 transition-transform group-hover:scale-105 pointer-events-none';
        }
        icon.className = iconClass;

        let resolvedSrc;
        if (link.icon && link.icon.startsWith('http')) {
            resolvedSrc = link.icon;
        } else if (iconCache.has(link.url)) {
            resolvedSrc = iconCache.get(link.url);
        } else {
            resolvedSrc = imgApi + link.url;
            iconCache.set(link.url, resolvedSrc);
        }
        let iconNode = icon;
        if (iconFailed.has(resolvedSrc)) {
            iconNode = createIconFallback(icon);
        } else {
            icon.src = resolvedSrc;
            icon.onload = function() {
                // 图标加载完成后淡入并隐藏 spinner
                this.classList.add('opacity-100');
                this.classList.remove('opacity-0');
                spinner.remove();
            };
            icon.onerror = function() {
                iconFailed.add(resolvedSrc);
                this.onerror = null; // 防止替换后再出错进入死循环
                this.replaceWith(createIconFallback(this));
                spinner.remove();
            };
        }
        if (iconNode === icon) iconWrap.appendChild(spinner);
        iconWrap.appendChild(iconNode);
        
        const title = document.createElement('div');
        const titleAlign = isAppLayout 
            ? 'text-center text-xs sm:text-sm font-medium mt-1 w-[120%] truncate px-1 text-slate-700 dark:text-slate-200 drop-shadow-sm' 
            : 'font-semibold text-sm flex-1 truncate text-slate-700 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors pointer-events-none';
        
        title.className = \`card-title pointer-events-none \${titleAlign}\`;
        title.textContent = link.name;
        
        header.appendChild(iconWrap);
        header.appendChild(title);

        const statusTag = document.createElement('span');
        statusTag.className = 'card-status-tag';
        statusTag.setAttribute('data-for', link.url);
        statusTag.textContent = '';
        header.appendChild(statusTag);

        card.appendChild(header);

        if (!isAppLayout) {
            const desc = document.createElement('div');
            desc.className = 'text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[1.25rem] card-tip leading-relaxed pointer-events-none w-full';
            desc.textContent = link.tips || '';
            card.appendChild(desc);
        }

        if (link.isPrivate && !isAppLayout) {
            const badge = document.createElement('div');
            badge.className = 'absolute top-0 right-0 w-8 h-8 pointer-events-none overflow-hidden rounded-tr-2xl';
            badge.innerHTML = '<div class="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-8 h-8 bg-amber-400"></div>';
            card.appendChild(badge);
        }

        const prevResult = latencyResults[siteKey(link.url)];
        if (prevResult === 'checking') {
            renderStatus(card, 'checking');
        } else if (prevResult) {
            renderStatus(card, prevResult);
        }

        if (isEditMode) {
            const actionWrapper = document.createElement('div');
            actionWrapper.className = isAppLayout 
                ? 'absolute top-[-4px] right-[-4px] z-30' 
                : 'absolute top-2 right-2 z-30';

            const menuBtn = document.createElement('button');
            const btnStyle = isAppLayout
                ? 'w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm hover:bg-emerald-500 dark:hover:bg-emerald-600 hover:text-white'
                : 'w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 backdrop-blur-sm';
            
            menuBtn.className = \`\${btnStyle} flex items-center justify-center transition-all duration-200\`;
            menuBtn.innerHTML = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>';
            
            const dropdown = document.createElement('div');
            dropdown.className = 'hidden absolute right-0 top-6 w-28 bg-white dark:bg-[#1e293b] rounded-xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden transform origin-top-right transition-all z-50 flex flex-col p-1 card-menu-dropdown';
            
            dropdown.innerHTML = \`
                <button class="menu-edit w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700/50 hover:text-emerald-600 transition-colors flex items-center gap-2">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    编辑
                </button>
                <button class="menu-delete w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors flex items-center gap-2">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    删除
                </button>
            \`;

            menuBtn.onclick = (e) => {
                e.stopPropagation();
                document.querySelectorAll('.card-menu-dropdown').forEach(el => {
                    if (el !== dropdown) el.classList.add('hidden');
                });
                dropdown.classList.toggle('hidden');
            };

            dropdown.querySelector('.menu-edit').onclick = (e) => {
                e.stopPropagation();
                dropdown.classList.add('hidden');
                showEditDialog(link);
            };

            dropdown.querySelector('.menu-delete').onclick = (e) => {
                e.stopPropagation();
                dropdown.classList.add('hidden');
                removeCard(card);
            };

            actionWrapper.appendChild(menuBtn);
            actionWrapper.appendChild(dropdown);
            card.appendChild(actionWrapper);
        }

        if (!isEditMode) {
            card.onclick = () => {
                 let url = link.url.startsWith('http') ? link.url : 'http://' + link.url;
                 window.open(url, '_blank');
            };
        }


        if (!isEditMode && link.tips) {
            card.classList.add('has-tooltip');
            card.setAttribute('data-tooltip', link.tips);
        }

        return card;
    }

    // 卡片级事件委托：drag/touch 只在容器上绑定一次，监听器数量与卡片数解耦
    function setupCardDelegation(container) {
        if (!container || container._cardDelegation) return;
        container._cardDelegation = true;

        container.addEventListener('dragstart', (e) => {
            const card = e.target.closest('.card');
            if (!card) return;
            dragStart.call(card, e);
        });
        container.addEventListener('dragover', (e) => {
            if (!isEditMode || !e.target.closest('.card-container')) return;
            dragOver(e);
        });
        container.addEventListener('dragend', (e) => {
            const card = e.target.closest('.card');
            if (card) card.classList.remove('dragging');
        });
        container.addEventListener('drop', drop);
        container.addEventListener('touchstart', (e) => {
            const card = e.target.closest('.card');
            if (!card) return;
            touchStart(e);
        }, { passive: false });

        // 全局关闭卡片菜单
        if (!window.hasAddedCardMenuListener) {
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.card-menu-dropdown') && !e.target.closest('button')) {
                    document.querySelectorAll('.card-menu-dropdown').forEach(el => el.classList.add('hidden'));
                }
            });
            window.hasAddedCardMenuListener = true;
        }

        // 分类标题栏操作按钮：事件委托，避免模板字符串内联 onClick 的注入风险
        container.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const action = btn.dataset.action;
            const category = btn.dataset.category;
            if (action === 'move') {
                moveCategory(category, Number(btn.dataset.dir) || 0);
            } else if (action === 'edit') {
                editCategoryName(category);
            } else if (action === 'pin') {
                pinCategory(category);
            } else if (action === 'delete') {
                deleteCategory(category);
            }
        });
        container.addEventListener('change', (e) => {
            const input = e.target.closest('[data-action="toggleHidden"], [data-action="togglePrivate"]');
            if (!input) return;
            const tipBox = input.closest('.has-tooltip');
            const isPrivate = input.dataset.action === 'togglePrivate';
            if (tipBox) tipBox.setAttribute('data-tooltip', input.checked ? (isPrivate ? '设为公开分类' : '显示分类') : (isPrivate ? '设为私密分类' : '隐藏分类'));
            if (isPrivate) {
                toggleCategoryPrivate(input.dataset.category, input.checked);
            } else {
                toggleCategoryHidden(input.dataset.category, input.checked);
            }
        });
    }
    
    function updateCategorySelect() {
        const menu = document.getElementById('category-select-menu');
        menu.innerHTML = '';
        Object.keys(categories).forEach(cat => {
            const item = document.createElement('div');
            item.className = 'px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700 cursor-pointer transition-colors';
            item.textContent = cat;
            item.onclick = () => {
                document.getElementById('category-select-value').value = cat;
                document.getElementById('category-select-text').textContent = cat;
                menu.classList.add('hidden');
            };
            menu.appendChild(item);
        });
    }

    // 增量更新：仅重建单个分类的卡片网格
    function renderCategoryGrid(category) {
        const grid = document.getElementById('grid-' + category);
        const cat = categories[category];
        if (!grid || !cat) return;

        const cardsFragment = document.createDocumentFragment();
        cat.links.forEach(link => {
            const card = createCard(link);
            if (card) cardsFragment.appendChild(card);
        });

        // 只移除既有卡片，保留编辑模式下的“+”占位符
        Array.from(grid.children).forEach(child => {
            if (!child.classList.contains('add-card-placeholder')) child.remove();
        });

        const placeholder = grid.querySelector('.add-card-placeholder');
        if (placeholder) {
            grid.insertBefore(cardsFragment, placeholder);
        } else {
            grid.appendChild(cardsFragment);
        }
    }

    async function addCard() {
        if (!await validateTokenOrRedirect()) return;
        const name = document.getElementById('name-input').value.trim();
        const url = document.getElementById('url-input').value.trim();
        const category = document.getElementById('category-select-value').value;
        
        if (!name || !url || !category) {
            await customAlert('请填写必要信息 (名称, URL, 分类)');
            return;
        }

        const newLink = {
            name, url, category,
            tips: document.getElementById('tips-input').value.trim(),
            icon: document.getElementById('icon-input').value.trim(),
            isPrivate: document.getElementById('private-checkbox').checked
        };

        hideAddDialog();

        categories[category].links.push(newLink);
        try {
            await saveLinks();
        } catch (e) {
            await customAlert('添加失败: ' + e);
        }
        // 增量更新：仅重建该分类网格（若该卡片本应可见）
        if (isEditMode || !newLink.isPrivate || isLoggedIn) {
            renderCategoryGrid(category);
            renderCategoryButtons();
        }
    }

    async function updateCard(oldLink) {
        if (!await validateTokenOrRedirect()) return;
        
        const updatedLink = {
            name: document.getElementById('name-input').value.trim(),
            url: document.getElementById('url-input').value.trim(),
            tips: document.getElementById('tips-input').value.trim(),
            icon: document.getElementById('icon-input').value.trim(),
            category: document.getElementById('category-select-value').value,
            isPrivate: document.getElementById('private-checkbox').checked
        };

        let found = false;
        let oldCategory = null;
        
        for (const cat in categories) {
             const idx = categories[cat].links.findIndex(l => l.url === oldLink.url);
             
             if (idx !== -1) {
                 found = true;
                 oldCategory = cat;
                 
                 if (cat === updatedLink.category) {
                     categories[cat].links[idx] = updatedLink;
                 } 
                 else {
                     categories[cat].links.splice(idx, 1);
                     
                     if(!categories[updatedLink.category]) {
                         categories[updatedLink.category] = { isHidden:false, isPrivate:false, links:[] };
                     }
                     categories[updatedLink.category].links.push(updatedLink);
                 }
                 break; 
             }
        }
        
        if (!found) {
             if(!categories[updatedLink.category]) {
                 categories[updatedLink.category] = { isHidden:false, isPrivate:false, links:[] };
             }
             oldCategory = updatedLink.category;
             categories[updatedLink.category].links.push(updatedLink);
        }

        hideAddDialog();
        await saveLinks();
        renderCategoryGrid(oldCategory);
        if (updatedLink.category !== oldCategory) renderCategoryGrid(updatedLink.category);
        renderCategoryButtons();
    }

    async function removeCard(card) {
        if (!await validateTokenOrRedirect()) return;
        const url = card.getAttribute('data-url');
        for (const cat in categories) {
            const idx = categories[cat].links.findIndex(l => l.url === url);
            if (idx !== -1) {
                categories[cat].links.splice(idx, 1);
                break;
            }
        }
        card.remove();
        await saveLinks();
    }

    // --- 拖拽辅助函数 ---
    function getCardState(card) {
        if(!card) return { category: null, index: -1 };
        const section = card.closest('.section');
        const index = Array.from(section.querySelectorAll('.card')).indexOf(card);
        return { category: section.id, index: index };
    }

    // --- 拖拽（电脑端） ---
    let draggedCard = null;
    function dragStart(e) {
        if (!isEditMode) { e.preventDefault(); return; }
        draggedCard = this;
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = "move";
        initialDragState = getCardState(this);
    }
    function dragOver(e) {
        if (!isEditMode) return;
        e.preventDefault();
        const target = e.target.closest('.card');
        if (target && target !== draggedCard) {
            const container = target.parentElement;
            const rect = target.getBoundingClientRect();
            if (e.clientX < rect.left + rect.width / 2) {
                container.insertBefore(draggedCard, target);
            } else {
                container.insertBefore(draggedCard, target.nextSibling);
            }
        }
    }
    async function drop(e) {
        if (!isEditMode) return;
        e.preventDefault();
        if (draggedCard) {
            const newState = getCardState(draggedCard);
            if (newState.category !== initialDragState.category || newState.index !== initialDragState.index) {
                updateCardCategory(draggedCard, newState.category);
                await saveCardOrder();
            }
            draggedCard = null;
        }
    }

    // 移动端拖拽
    let mobileDragTimer = null;
    let isMobileDragging = false;
    let mobilePlaceholder = null; 
    let mobileClone = null;       
    let mobileTouchOffset = { x: 0, y: 0 }; 
    let rafId = null;             
    let lastTouchX = 0;
    let lastTouchY = 0;
    let lastSwapTime = 0;         
    let activeContainer = null;
    let cloneWidth = 0;
    let cloneHeight = 0;

    function touchStart(e) {
        if (!isEditMode) return;
        if (e.touches.length > 1) return; 

        const card = e.target.closest('.card');
        if (!card) return;

        const touch = e.touches[0];
        const startX = touch.clientX;
        const startY = touch.clientY;

        if (mobileDragTimer) clearTimeout(mobileDragTimer);

        mobileDragTimer = setTimeout(() => {
            isMobileDragging = true;
            mobilePlaceholder = card;
            activeContainer = mobilePlaceholder.parentElement;
            
            initialDragState = getCardState(mobilePlaceholder);

            const rect = mobilePlaceholder.getBoundingClientRect();
            cloneWidth = rect.width;
            cloneHeight = rect.height;

            mobileTouchOffset.x = startX - rect.left;
            mobileTouchOffset.y = startY - rect.top;
            
            lastTouchX = startX;
            lastTouchY = startY;

            mobileClone = mobilePlaceholder.cloneNode(true);
            
            Object.assign(mobileClone.style, {
                position: 'fixed',
                left: rect.left + 'px',
                top: rect.top + 'px',
                width: rect.width + 'px',
                height: rect.height + 'px',
                zIndex: '9999',
                opacity: '0.95',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)', 
                transform: 'scale(1.05)', 
                transition: 'none'
            });
            mobileClone.classList.add('card-clone-dragging');
            mobileClone.classList.remove('group', 'hover:-translate-y-1', 'transition-all', 'duration-300');
            document.body.appendChild(mobileClone);

            // 占位符样式
            mobilePlaceholder.style.opacity = '0.3';
            mobilePlaceholder.classList.add('border-dashed', 'border-2', 'border-emerald-400');

            if (navigator.vibrate) navigator.vibrate(50);
            
            updatePosition();
        }, 500);

        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
        document.addEventListener('touchcancel', handleTouchEnd);

        function updatePosition() {
            if (!isMobileDragging || !mobileClone) return;
            
            const x = lastTouchX - mobileTouchOffset.x;
            const y = lastTouchY - mobileTouchOffset.y;
            
            mobileClone.style.left = x + 'px';
            mobileClone.style.top = y + 'px';
            
            rafId = requestAnimationFrame(updatePosition);
        }

        function handleTouchMove(moveEvent) {
            const moveTouch = moveEvent.touches[0];

            if (!isMobileDragging) {
                const diffX = moveTouch.clientX - startX;
                const diffY = moveTouch.clientY - startY;
                const distance = Math.sqrt(diffX * diffX + diffY * diffY);

                if (distance > 10) {
                    clearTimeout(mobileDragTimer);
                    mobileDragTimer = null;
                }
                
                return;
            }

            if (isMobileDragging) {
                moveEvent.preventDefault(); 
                
                lastTouchX = moveTouch.clientX;
                lastTouchY = moveTouch.clientY;

                const now = Date.now();
                if (now - lastSwapTime > 30) { 
                    detectSort(moveTouch.clientX, moveTouch.clientY);
                }
            }
        }

        function detectSort(fingerX, fingerY) {
            let elementBelow = document.elementFromPoint(fingerX, fingerY);
            if (!elementBelow) return;

            let targetCard = elementBelow.closest('.card') || elementBelow.closest('.add-card-placeholder');
            let targetContainer = targetCard ? targetCard.parentElement : elementBelow.closest('.card-container');
            
            if (!targetContainer) return;

            if (activeContainer !== targetContainer) {
                activeContainer = targetContainer;
                const placeholderBtn = activeContainer.querySelector('.add-card-placeholder');
                if (placeholderBtn) {
                    activeContainer.insertBefore(mobilePlaceholder, placeholderBtn);
                } else {
                    activeContainer.appendChild(mobilePlaceholder);
                }
                lastSwapTime = Date.now();
                return;
            }

            const containerRect = activeContainer.getBoundingClientRect();
            
            const cloneViewportCenterX = lastTouchX - mobileTouchOffset.x + (cloneWidth / 2);
            const cloneViewportCenterY = lastTouchY - mobileTouchOffset.y + (cloneHeight / 2);

            const cloneRelX = cloneViewportCenterX - containerRect.left + activeContainer.scrollLeft;
            const cloneRelY = cloneViewportCenterY - containerRect.top + activeContainer.scrollTop;

            const siblings = Array.from(activeContainer.children).filter(c => 
                (c.classList.contains('card') || c.classList.contains('add-card-placeholder')) && c !== mobilePlaceholder
            );

            if (siblings.length === 0) return;

            let closestElement = null;
            let minDistance = Infinity;

            for (const child of siblings) {
                const childCenterX = child.offsetLeft + child.offsetWidth / 2;
                const childCenterY = child.offsetTop + child.offsetHeight / 2;
                
                const dist = Math.hypot(cloneRelX - childCenterX, cloneRelY - childCenterY);
                
                if (dist < minDistance) {
                    minDistance = dist;
                    closestElement = child;
                }
            }

            if (closestElement) {
                const positionsBefore = new Map();
                const allChildren = Array.from(activeContainer.children).filter(el => 
                    el.classList.contains('card') || el.classList.contains('add-card-placeholder')
                );
                allChildren.forEach(el => positionsBefore.set(el, el.getBoundingClientRect()));

                const placeholderIndex = allChildren.indexOf(mobilePlaceholder);
                const targetIndex = allChildren.indexOf(closestElement);

                if (targetIndex > placeholderIndex) {
                    activeContainer.insertBefore(mobilePlaceholder, closestElement.nextSibling);
                } else {
                    activeContainer.insertBefore(mobilePlaceholder, closestElement);
                }
                
                animateFlip(activeContainer, positionsBefore);
                
                lastSwapTime = Date.now();
                if(navigator.vibrate) navigator.vibrate(10);
            }
        }

        function animateFlip(container, positionsBefore) {
            const siblings = Array.from(container.children);
            siblings.forEach(el => {
                if (el === mobilePlaceholder) return;
                
                const rectAfter = el.getBoundingClientRect();
                const rectBefore = positionsBefore.get(el);

                if (rectBefore && (rectBefore.left !== rectAfter.left || rectBefore.top !== rectAfter.top)) {
                    const dx = rectBefore.left - rectAfter.left;
                    const dy = rectBefore.top - rectAfter.top;

                    el.style.transition = 'none';
                    el.style.transform = \`translate(\${dx}px, \${dy}px)\`;
                    el.offsetHeight; 
                    el.style.transition = 'transform 0.2s cubic-bezier(0.2, 0, 0.2, 1)';
                    el.style.transform = '';

                    setTimeout(() => {
                        if (el.style.transform === '') {
                            el.style.transition = '';
                        }
                    }, 200);
                }
            });
        }

        function handleTouchEnd() {
            if (mobileDragTimer) {
                clearTimeout(mobileDragTimer);
                mobileDragTimer = null;
            }
            if (rafId) cancelAnimationFrame(rafId);
            
            if (isMobileDragging) {
                // 离场动画
                if (mobileClone && mobilePlaceholder) {
                    const rect = mobilePlaceholder.getBoundingClientRect();
                    mobileClone.style.transition = 'all 0.2s ease-out';
                    mobileClone.style.left = rect.left + 'px';
                    mobileClone.style.top = rect.top + 'px';
                    mobileClone.style.opacity = '0';

                    setTimeout(() => {
                        if (mobileClone) mobileClone.remove();
                        if (mobilePlaceholder) {
                             mobilePlaceholder.style.opacity = '';
                             mobilePlaceholder.classList.remove('border-dashed', 'border-2', 'border-emerald-400');
                        }
                        
                        // 保存排序
                        saveCardOrder();

                        mobilePlaceholder = null;
                        mobileClone = null;
                    }, 200);
                } else {
                    if (mobileClone) mobileClone.remove();
                    if (mobilePlaceholder) mobilePlaceholder.style.opacity = '';
                }

                document.body.style.overflow = '';
            }
            
            isMobileDragging = false;
            cleanupListeners();
        }

        function cleanupListeners() {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            document.removeEventListener('touchcancel', handleTouchEnd);
        }
    }

    function updateCardCategory(card, newCategory) {
        const url = card.getAttribute('data-url');
        let item = null;
        for (const cat in categories) {
             const idx = categories[cat].links.findIndex(l => l.url === url);
             if (idx !== -1) {
                 item = categories[cat].links.splice(idx, 1)[0];
                 break;
             }
        }
        if(item) {
            item.category = newCategory;
            categories[newCategory].links.push(item);
        }
    }

    async function saveCardOrder() {
        const newCategories = {};
        const sections = document.querySelectorAll('.section');
        sections.forEach(sec => {
            const catName = sec.id;
            const oldCat = categories[catName];
            newCategories[catName] = { isHidden: oldCat ? oldCat.isHidden : false, isPrivate: oldCat ? oldCat.isPrivate : false, links: [] };
            
            const cards = sec.querySelectorAll('.card');
            cards.forEach(c => {
                 const url = c.getAttribute('data-url');
                 const original = Object.values(categories).flatMap(x=>x.links).find(l=>l.url === url);
                 if(original) {
                     original.category = catName;
                     newCategories[catName].links.push(original);
                 }
            });
        });
        
        Object.keys(categories).forEach(k => delete categories[k]);
        Object.assign(categories, newCategories);
        await saveDataToServer('保存排序', categories);
    }

    function applyTheme(isDark) {
        if (isDark) {
             document.documentElement.classList.add('dark');
        } else {
             document.documentElement.classList.remove('dark');
        }
        updateThemeSwitchUI();
    }
    
    function updateThemeSwitchUI() {
        const isDark = document.documentElement.classList.contains('dark');
        const checkbox = document.getElementById('theme-switch-checkbox');
        if(checkbox) checkbox.checked = isDark;
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // 认证和模式
    async function toggleEditMode() {
        document.getElementById('profile-dropdown').classList.add('hidden');
        if (!isLoggedIn) {
            toggleLogin();
            return;
        }

        if (!isEditMode) {
             isEditMode = true;
             updateUIState();
             
             renderCategories(); 
             
             // 提示用户
             // logAction('进入编辑模式', {}); 
        } else {
             // 退出编辑模式
             isEditMode = false;
             updateUIState();
             renderCategories();
        }
    }
    
    async function toggleLogin() {
        if (!isLoggedIn) {
             toggleOverlay('password-dialog-overlay', true);
             document.getElementById('password-input').focus();
        } else {
             if (await customConfirm('确定退出登录吗？')) {
                 logout();
             }
        }
    }
    
    function showAddDialog() {
        toggleOverlay('dialog-overlay', true);
        document.getElementById('name-input').value = '';
        document.getElementById('url-input').value = '';
        document.getElementById('tips-input').value = '';
        document.getElementById('icon-input').value = '';
        document.getElementById('private-checkbox').checked = false;
        
        document.getElementById('category-select-value').value = '';
        document.getElementById('category-select-text').textContent = '请选择分类';
        
        const btn = document.getElementById('dialog-confirm-btn');
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.onclick = addCard;
        
        document.getElementById('dialog-cancel-btn').onclick = hideAddDialog;
    }
    
    function showEditDialog(link) {
        toggleOverlay('dialog-overlay', true);
        document.getElementById('name-input').value = link.name;
        document.getElementById('url-input').value = link.url;
        document.getElementById('tips-input').value = link.tips || '';
        document.getElementById('icon-input').value = link.icon || '';
        document.getElementById('private-checkbox').checked = link.isPrivate;
        
        document.getElementById('category-select-value').value = link.category;
        document.getElementById('category-select-text').textContent = link.category;
        
        const btn = document.getElementById('dialog-confirm-btn');
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.onclick = () => updateCard(link);
        
        document.getElementById('dialog-cancel-btn').onclick = hideAddDialog;
    }
    
    function hideAddDialog() {
        toggleOverlay('dialog-overlay', false);
    }

    document.getElementById('password-confirm-btn').onclick = async () => {
         const pwd = document.getElementById('password-input').value;
         if(!pwd) return;
         try {
             const res = await fetch('/api/login', {
                 method: 'POST',
                 headers: {'Content-Type': 'application/json'},
                 body: JSON.stringify({password: pwd})
             });
             const data = await res.json();
             if(data.valid) {
                 localStorage.setItem('authToken', data.token);
                 isLoggedIn = true;
                 toggleOverlay('password-dialog-overlay', false);
                 await loadLinks();
                 await customAlert('登录成功');
             } else if (res.status === 429 && data.locked) {
                 await customAlertRateLimit(data.retryAfter || 900);
             } else {
                 var remMsg = '密码错误';
                 var remaining = typeof data.remaining === 'number' ? data.remaining : 0;
                 if (remaining > 0) remMsg = '密码错误，还可尝试 ' + remaining + ' 次';
                 await customAlert(remMsg);
             }
         } catch(e) { await customAlert('Login Error'); }
    }

    async function fetchWithAuth(url, options = {}) {
        const token = localStorage.getItem('authToken');
        const headers = options.headers || {};
        headers.Authorization = token;
        options.headers = headers;

        let res = await fetch(url, options);

        if (res.status === 401) {
            try {
                const refreshRes = await fetch('/api/refreshToken', {
                    method: 'POST',
                    credentials: 'include' 
                });

                if (refreshRes.ok) {
                    const refreshData = await refreshRes.json();
                    localStorage.setItem('authToken', refreshData.accessToken);
                    headers.Authorization = refreshData.accessToken;
                    options.headers = headers;
                    res = await fetch(url, options);
                } else {
                    throw new Error('Refresh token expired');
                }
            } catch (refreshError) {
                localStorage.removeItem('authToken');
                isLoggedIn = false;
                toggleOverlay('password-dialog-overlay', true);
                await customAlert('登录已过期，请重新登录');
                throw new Error('Unauthorized');
            }
        }

        return res;
    };
    
    document.getElementById('password-cancel-btn').onclick = () => {
         toggleOverlay('password-dialog-overlay', false);
    };

    function showCategoryDialog(title, defaultVal = '') {
        return new Promise(resolve => {
            toggleOverlay('category-dialog', true);
            document.getElementById('category-dialog-title').innerText = title;
            const input = document.getElementById('category-name-input');
            input.value = defaultVal;
            input.focus();
            
            const close = (val) => {
                toggleOverlay('category-dialog', false);
                document.getElementById('category-confirm-btn').onclick = null;
                document.getElementById('category-cancel-btn').onclick = null;
                resolve(val);
            };
            
            document.getElementById('category-confirm-btn').onclick = () => close(input.value.trim());
            document.getElementById('category-cancel-btn').onclick = () => close(null);
        });
    }

    function customConfirm(msg, okText = '确定', cancelText = '取消') {
        return new Promise(resolve => {
            toggleOverlay('custom-confirm-overlay', true);
            document.getElementById('custom-confirm-message').innerText = msg;
            const okBtn = document.getElementById('custom-confirm-ok');
            const cancelBtn = document.getElementById('custom-confirm-cancel');
            okBtn.innerText = okText;
            cancelBtn.innerText = cancelText;
            
            const close = (val) => {
                toggleOverlay('custom-confirm-overlay', false);
                document.getElementById('custom-confirm-ok').onclick = null;
                document.getElementById('custom-confirm-cancel').onclick = null;
                okBtn.innerText = '确定';
                cancelBtn.innerText = '取消';
                resolve(val);
            };
            document.getElementById('custom-confirm-ok').onclick = () => close(true);
            document.getElementById('custom-confirm-cancel').onclick = () => close(false);
        });
    }

    function customAlert(msg) {
        return new Promise(resolve => {
             toggleOverlay('custom-alert-overlay', true);
             document.getElementById('custom-alert-content').innerText = msg;
             document.getElementById('custom-alert-confirm').onclick = () => {
                 toggleOverlay('custom-alert-overlay', false);
                 resolve();
             }
        });
    }

    function customAlertRateLimit(seconds) {
        return new Promise(resolve => {
            const content = document.getElementById('custom-alert-content');
            toggleOverlay('custom-alert-overlay', true);
            const timer = setInterval(() => {
                if (seconds > 0) {
                    content.innerText = '登录已被限制，请' + seconds + '秒后再试';
                    seconds--;
                } else {
                    clearInterval(timer);
                    content.innerText = '已过限时，可重新尝试登录';
                }
            }, 1000);
            document.getElementById('custom-alert-confirm').onclick = () => {
                clearInterval(timer);
                toggleOverlay('custom-alert-overlay', false);
                resolve();
            }
        });
    }

    function setupTooltipDelegation() {
        const tooltip = document.getElementById('custom-tooltip');
        let activeTarget = null;

        document.body.addEventListener('mousemove', (e) => {
            const target = e.target.closest('.has-tooltip');

            if (target) {
                const text = target.getAttribute('data-tooltip');
                if (text) {
                    activeTarget = target;
                    showTooltip(e, text);
                } else {
                    hideTooltip();
                }
            } else {
                if (activeTarget) {
                    hideTooltip();
                    activeTarget = null;
                }
            }
        });

        window.addEventListener('scroll', hideTooltip, { passive: true });
    }

    function showTooltip(e, text) {
        const tooltip = document.getElementById('custom-tooltip');
        tooltip.textContent = text;
        tooltip.classList.remove('hidden');

        const offset = 12; 
        let left = e.clientX + offset;
        let top = e.clientY + offset;
        
        const tooltipRect = tooltip.getBoundingClientRect();
        
        if (left + tooltipRect.width > window.innerWidth) {
            left = e.clientX - tooltipRect.width - offset;
        }
        if (top + tooltipRect.height > window.innerHeight) {
            top = e.clientY - tooltipRect.height - offset;
        }
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    function hideTooltip() {
        const tooltip = document.getElementById('custom-tooltip');
        if (tooltip && !tooltip.classList.contains('hidden')) {
            tooltip.classList.add('hidden');
        }
    }
    

    async function backupUserData() {
        try {
            const res = await fetchWithAuth('/api/backupData', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({}),
            });
            if(res.status === 401) {
                logout();
                await customAlert('登录凭证已过期，请重新登录');
                return false;
            }
            const d = await res.json();
            return d.success;
        } catch(e) { return false; }
    }
    
    async function reloadCardsAsAdmin() {
         await loadLinks();
    }
    
    async function validateTokenOrRedirect() {
        const valid = await validateToken();
        if(!valid) {
            logout();
            await customAlert('登录凭证已过期，请重新登录');
            return false;
        }
        return true;
    }
    
    async function validateToken() {
        const t = localStorage.getItem('authToken');
        if(!t) return false;
        try {
            const r = await fetchWithAuth('/api/validateToken');
            return r.status === 200;
        } catch(e) { return false; }
    }
    
    function logout() {
        localStorage.removeItem('authToken');
        isLoggedIn = false;
        isEditMode = false;
        location.reload();
    }
    
    async function exportData() {
        if(!await validateTokenOrRedirect()) return;
        if(!await customConfirm("确定要导出数据吗？")) return;
        
        try {
            const res = await fetchWithAuth("/api/exportData", {
                method: "POST"
            });
            
            if (res.status === 401) {
                logout();
                await customAlert('登录凭证已过期，请重新登录');
                return;
            }
            
            if (!res.ok) throw new Error("Export failed");
            const data = await res.json();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "nav_export_" + new Date().toISOString().split("T")[0] + ".json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch(e) { 
            if(e.message !== 'Unauthorized') await customAlert("导出失败"); 
        }
    }
    
    // 解析 Chrome / Edge 导出的 Netscape 书签 HTML
    function parseBookmarks(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const categories = {};

        // 清洗书签标题:按分隔符(|、英文/中文冒号 : ：、两边带可选空格的 -/–/—)拆分
        function cleanTitle(title) {
            const raw = (title || '').trim();

            if (!raw) {
                return { name: '', tips: '' };
            }

            // 1. 判断是否以 http:// 或 https:// 开头（整体是 URL）
            if (/^https?:\\/\\//i.test(raw)) {
                try {
                    const urlObj = new URL(raw);
                    const name = (urlObj.hostname + urlObj.pathname).replace(/\\/$/, '');
                    return { name: name || raw, tips: raw };
                } catch (e) {
                    return { name: raw, tips: raw };
                }
            }

            // 2. 正常文本标题拆分
            const sep = /[|:：]|\\s+[-–—]\\s+/;

            const idx = raw.search(sep);
            if (idx === -1) {
                return { name: raw, tips: raw };
            }

            const name = raw.slice(0, idx).trim();
            const tips = raw.slice(idx).replace(/^[\\s|:：–—-]+/, '').trim();

            return {
                name: name || raw,
                tips: tips || raw
            };
        }

        function getLinks(dl) {
            const links = [];
            const dts = Array.from(dl.children).filter(e => e && e.tagName === 'DT');
            for (const dt of dts) {
                const a = dt.querySelector(':scope > a');
                if (!a) continue;
                const url = (a.getAttribute('href') || '').trim();
                if (!url) continue;
                if (/^(javascript:|vbscript:|data:|chrome:|edge:|about:|magnet:)/i.test(url)) continue;
                const clean = cleanTitle(a.textContent);
                links.push({ name: clean.name, url, tips: clean.tips, icon: '', category: null, isPrivate: true });
            }
            return links;
        }

        // 递归处理一个文件夹:子文件夹生成独立分类,当前文件夹的直接链接归入当前分类
        function processFolder(dl, catName) {
            const folderDts = Array.from(dl.children).filter(e => e && e.tagName === 'DT' && e.querySelector(':scope > dl'));
            for (const dt of folderDts) {
                const h3 = dt.querySelector(':scope > h3');
                const childDl = dt.querySelector(':scope > dl');
                const subName = h3 ? h3.textContent.trim() : '未分类';
                processFolder(childDl, subName);
            }
            const links = getLinks(dl);
            if (catName && links.length) {
                if (!categories[catName]) categories[catName] = { isHidden: false, isPrivate: false, links: [] };
                links.forEach(l => { l.category = catName; categories[catName].links.push(l); });
            }
        }

        const rootDl = doc.querySelector('dl');
        if (!rootDl) return null;

        const rootDts = Array.from(rootDl.children).filter(e => e && e.tagName === 'DT');
        for (const dt of rootDts) {
            const childDl = dt.querySelector(':scope > dl');
            const h3 = dt.querySelector(':scope > h3');
            if (childDl && h3) {
                processFolder(childDl, h3.textContent.trim());
            } else {
                const a = dt.querySelector(':scope > a');
                if (!a) continue;
                const url = (a.getAttribute('href') || '').trim();
                if (!url || /^(javascript:|vbscript:|data:|chrome:|edge:|about:|magnet:)/i.test(url)) continue;
                const clean = cleanTitle(a.textContent);
                if (!categories['未分类']) categories['未分类'] = { isHidden: false, isPrivate: false, links: [] };
                categories['未分类'].links.push({ name: clean.name, url, tips: clean.tips, icon: '', category: '未分类', isPrivate: true });
            }
        }

        return Object.keys(categories).length ? { categories } : null;
    }

    // 合并导入：以现有数据为基础，导入新分类/链接（同名分类合并、按 URL 去重）
    function mergeImportData(currentCats, importedData) {
        const merged = {};
        Object.keys(currentCats).forEach(key => {
            const cat = currentCats[key];
            merged[key] = {
                isHidden: !!cat.isHidden,
                isPrivate: !!cat.isPrivate,
                links: Array.isArray(cat.links) ? cat.links.slice() : []
            };
        });

        const importedCats = (importedData && importedData.categories) || {};
        Object.keys(importedCats).forEach(catName => {
            const importedLinks = (importedCats[catName] && importedCats[catName].links) || [];
            if (!merged[catName]) merged[catName] = { isHidden: false, isPrivate: false, links: [] };
            const existingUrls = new Set(merged[catName].links.map(l => l.url));
            importedLinks.forEach(link => {
                if (link && link.url && !existingUrls.has(link.url)) {
                    merged[catName].links.push({ ...link, category: catName, isPrivate: true });
                    existingUrls.add(link.url);
                }
            });
        });
        return merged;
    }

    async function importData() {
        if(!await validateTokenOrRedirect()) return;
        
        const fileInput = document.getElementById('import-file-input');
        fileInput.value = '';
        
        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                const reader = new FileReader();
                reader.onload = async (event) => {
                    try {
                        const content = event.target.result;
                        const trimmed = content.trimStart();
                        let data;
                        if (trimmed.startsWith('<!DOCTYPE') || /<(DL|H3)\b/i.test(trimmed)) {
                            // Chrome / Edge 书签 HTML
                            data = parseBookmarks(content);
                            if (!data) throw new Error("No valid bookmarks found");
                        } else {
                            // 本项目导出的 JSON 配置
                            data = JSON.parse(content);
                            if (typeof data !== 'object' || data === null) throw new Error("Invalid JSON");
                        }
                        // 导入的所有链接默认设为私密(仅登录可见)
                        if (data && data.categories) {
                            for (const catObj of Object.values(data.categories)) {
                                if (catObj && Array.isArray(catObj.links)) {
                                    for (const link of catObj.links) {
                                        if (link) link.isPrivate = true;
                                    }
                                }
                            }
                        }
                        // 选择导入方式：合并 or 覆盖
                        const mergeMode = await customConfirm(
                            '请选择导入方式：\\n\\n【合并】保留现有分类与链接，导入内容追加进去（同名分类按 URL 去重合并）\\n\\n【覆盖】清空现有全部数据，仅保留本次导入内容',
                            '合并导入', '覆盖导入'
                        );
                        let payload = data;
                        if (mergeMode) {
                            payload = { categories: mergeImportData(categories, data) };
                        }
                        const res = await fetchWithAuth("/api/importData", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(payload)
                        });
                        if (res.status === 401) {
                            logout();
                            await customAlert('登录凭证已过期，请重新登录');
                            return;
                        }
                        if (!res.ok) throw new Error("Import failed");
                        await customAlert('数据导入成功！');
                        location.reload(); 
                    } catch (error) {
                        console.error("解析文件失败:", error);
                        await customAlert('文件格式错误，请检查文件内容！');
                    }
                };
                reader.readAsText(file);
            } catch (error) {
                console.error("导入失败:", error);
                await customAlert('数据导入失败，请重试！');
            }
        };
        fileInput.click();
    }

    </script>
</body>
</html>
`;

const DEFAULT_USER = 'testUser';
const DEFAULT_IMGAPI = 'https://api.xinac.net/icon/?url=';
let USE_DEFAULT_IMGAPI = true;

function base64UrlEncode(str) {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlEncodeUint8(arr) {
    const str = String.fromCharCode(...arr);
    return base64UrlEncode(str);
}

function base64UrlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return atob(str);
}

async function createJWT(payload, secret) {
    const encoder = new TextEncoder();
    const header = { alg: 'HS256', typ: 'JWT' };
    const headerEncoded = base64UrlEncode(JSON.stringify(header));
    const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
    const toSign = encoder.encode(`${headerEncoded}.${payloadEncoded}`);

    const key = await crypto.subtle.importKey(
        'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, toSign);
    const signatureEncoded = base64UrlEncodeUint8(new Uint8Array(signature));

    return `${headerEncoded}.${payloadEncoded}.${signatureEncoded}`;
}

async function validateJWT(token, secret) {
    try {
        const encoder = new TextEncoder();
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const [headerEncoded, payloadEncoded, signature] = parts;
        const data = encoder.encode(`${headerEncoded}.${payloadEncoded}`);

        const key = await crypto.subtle.importKey(
            'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
        );

        const expectedSigBuffer = await crypto.subtle.sign('HMAC', key, data);
        const expectedSig = base64UrlEncodeUint8(new Uint8Array(expectedSigBuffer));

        if (signature !== expectedSig) return null;

        const payloadStr = base64UrlDecode(payloadEncoded);
        return JSON.parse(payloadStr);
    } catch (e) {
        return null;
    }
}

function parseCookie(cookieHeader) {
    const cookies = {};
    if (!cookieHeader) return cookies;
    cookieHeader.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        cookies[name] = decodeURIComponent(value);
    });
    return cookies;
}

async function validateServerToken(authHeader, env) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { isValid: false, status: 401, response: { error: 'Unauthorized', message: '未登录' } };
    }
    const token = authHeader.slice(7);
    
    const payload = await validateJWT(token, env.JWT_SECRET);
    
    if (!payload) {
        return { isValid: false, status: 401, response: { error: 'Invalid', message: 'Token无效' } };
    }
    
    if (payload.exp < Math.floor(Date.now() / 1000)) {
        return { isValid: false, status: 401, response: { error: 'Expired', message: 'Token过期' } };
    }

    if (payload.type !== 'access') {
        return { isValid: false, status: 403, response: { error: 'Forbidden', message: '令牌类型错误' } };
    }

    return { isValid: true, payload };
}

function normalizeCategories(categories) {
    for (const key in categories) {
        if (Array.isArray(categories[key])) {
            categories[key] = { isHidden: false, isPrivate: false, links: categories[key] };
        }
    }
    return categories;
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
    'Access-Control-Allow-Credentials': 'true' 
};

async function fetchBestIcon(targetUrl) {
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    };

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); 
        
        const response = await fetch(targetUrl, {
            headers: headers,
            redirect: 'follow',
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('Site unreachable');

        let iconUrl = null;
        
        const rewriter = new HTMLRewriter()
            .on('link[rel="apple-touch-icon"]', { 
                element(e) {
                    if (!iconUrl) {
                        const href = e.getAttribute('href');
                        if (href) iconUrl = href;
                    }
                }
            })
            .on('link[rel~="icon"]', {
                element(e) {
                    if (!iconUrl) {
                        const href = e.getAttribute('href');
                        if (href) iconUrl = href;
                    }
                }
            });

        await rewriter.transform(response).text();

        let finalUrl;
        if (iconUrl) {
            finalUrl = new URL(iconUrl, targetUrl).toString();
        } else {
            finalUrl = new URL('/favicon.ico', targetUrl).toString();
        }

        const iconResponse = await fetch(finalUrl, { 
            headers: headers 
        });

        if (iconResponse.ok && iconResponse.headers.get('content-type')?.includes('image')) {
            return iconResponse;
        }
        
        throw new Error('Icon fetch failed');

    } catch (e) {
    }
    return null;
}

async function handleIconProxy(request, ctx) {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) return new Response('Missing URL', { status: 400 });

    const cacheKey = new Request(url.toString(), request);
    const cache = caches.default;
    
    let response = await cache.match(cacheKey);

    if (response) {
        response = new Response(response.body, response);
        response.headers.set('X-Icon-Cache-Status', 'HIT');
    } else {
        let upstreamResponse = null;
        if (USE_DEFAULT_IMGAPI) {
            const upstreamApi = `${DEFAULT_IMGAPI}${encodeURIComponent(targetUrl)}`;
            upstreamResponse = await fetch(upstreamApi, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
            });
        } else {
            upstreamResponse = await fetchBestIcon(targetUrl);
        }
        if (upstreamResponse) {
            response = new Response(upstreamResponse.body, upstreamResponse);
            response.headers.set('Cache-Control', 'public, max-age=604800, s-maxage=604800');
            response.headers.set('Access-Control-Allow-Origin', '*');
            response.headers.set('X-Icon-Cache-Status', 'MISS');
            ctx.waitUntil(cache.put(cacheKey, response.clone()));
        } else {
            const defaultSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64">
                <path fill="#000000" d="M62 32C62 15.432 48.568 2 32 2C15.861 2 2.703 14.746 2.031 30.72c-.008.196-.01.395-.014.592c-.005.23-.017.458-.017.688v.101C2 48.614 15.432 62 32 62s30-13.386 30-29.899l-.002-.049zM37.99 59.351c-.525-.285-1.029-.752-1.234-1.388c-.371-1.152-.084-2.046.342-3.086c.34-.833-.117-1.795.109-2.667c.441-1.697.973-3.536.809-5.359c-.102-1.119-.35-1.17-1.178-1.816c-.873-.685-.873-1.654-1.457-2.52c-.529-.787.895-3.777.498-3.959c-.445-.205-1.457.063-1.777-.362c-.344-.458-.584-.999-1.057-1.354c-.305-.229-1.654-.995-2.014-.941c-1.813.271-3.777-1.497-4.934-2.65c-.797-.791-1.129-1.678-1.713-2.593c-.494-.775-1.242-.842-1.609-1.803c-.385-1.004-.156-2.29-.273-3.346c-.127-1.135-.691-1.497-1.396-2.365c-1.508-1.863-2.063-4.643-4.924-4.643c-1.537 0-1.428 3.348-2.666 2.899c-1.4-.507-3.566 1.891-3.535 1.568c.164-1.674 1.883-2.488 2.051-2.987c.549-1.638-2.453-1.246-2.068-2.612c.188-.672 2.098-1.161 1.703-1.562c-.119-.122-1.58-1.147-1.508-1.198c.271-.19 1.449.412 1.193-.37c-.086-.26-.225-.499-.357-.74a28 28 0 0 1 1.92-1.975c1.014-.083 2.066-.02 2.447.054c2.416.476 3.256 1.699 5.672.794c1.162-.434 5.445.319 6.059 1.537c.334.666 1.578-.403 2.063-.475c.52-.078 1.695.723 2.053.232c.943-1.291-.604-1.827 1.223-.833c1.225.667 3.619-2.266 2.861 1.181c-.547 2.485-2.557 2.54-4.031 4.159c-1.451 1.594 2.871 2.028 2.982 3.468c.32 4.146 2.531-.338 1.939-1.812c-1.145-2.855 1.303-2.071 2.289-.257c.547 1.007.963.159 1.633-.192c.543-.283.688 1.25.805 1.517c.385.887 1.65 1.152 1.436 2.294c-.238 1.259-1.133.881-2.008 1.094c-.977.237.158 1.059.016 1.359c-.154.328-1.332.464-1.646.65c-.924.544-.359 1.605-1.082 2.175c-.496.392-.996.137-1.092.871c-.113.865-1.707 1.143-1.5 1.97c.057.227.516 1.923.227 2.013c-.133.043-1.184-1.475-1.471-1.627c-.568-.301-3.15-.055-3.482 1.654c-.215 1.105 1.563 2.85 2.016 1.328c.561-1.873.828 1.091.693 1.207c.268.234 1.836-.385 1.371.7c-.197.459.193 1.656.889 1.287c.291-.154 1.041.31 1.172.061a2.14 2.14 0 0 1 .742-.692c.701-.41 1.75-.025 2.518.02c.469.027 4.313 2.124 4.334 2.545c.084 1.575 2.99 1.37 3.436 1.933c1.199 1.526.83.751-.045 2.706c-.441.984-.057 2.191-1.125 2.904c-.514.342-1.141.171-1.598.655c-.412.437-.25.959-.5 1.464c-.301.601-4.346 4.236-4.613 5.115c-.133.441-1.34.825-.322 1.248c.592.174-1.311 1.973-.396 2.718c.223.181.369.334.479.471c-.457.122-.91.233-1.369.333M35.594 4.237c-.039.145.02.316.271.483c.566.375-.162 1.208-.943.671c-.779-.537-2.531.241-2.41.644c.119.403.66.563 1.496.242c.834-.322 1.178.048 1.318.43c.096.259 0 .403-.027.752c-.025.349-.996.107-1.803.162c-.809.054-1.67-.162-1.645-.619c.027-.456-.861-1.289-1.391-1.637c-.529-.348.232-1.1.934-.537c.699.564.727-.107 1.535-.321c.459-.122.275-.305.119-.479q1.29.047 2.546.209m3.517 8.869c.605.164 1.656.929 1.656 1.291c0 .363-.477.817-.688.765c-1.523-.371-2.807-1.874-3.514-2.697c-1.234-1.435-1.156-.205-3.111-.826c-.5-.16-1.293-1.711-.768-2.476s1.131-.886 1.615-.683c.484.2 1.898-.645 2.223.362c.322 1.007 1.211 2.292 2.02 2.636c.81.342-.04 1.464.567 1.628m.485 4.673c.242.483-1.455-.564-1.859-1.047c-.402-.482-1.01-1.571-.523-2.054c.484-.482 1.57 1.005 2.141 1.33c1.129.645-.001 1.289.241 1.771m-8.594-7.315c.117-.161.365.242.586.645s-.084.971-.586.885c-.502-.084-.281-1.136 0-1.53m0-4.052s.473 1.154 0 .966s-.496-.671 0-.966m.096 3.65c-.135-.321-.166-1.64.162-2.04c.484-.59 1.266.564.74 1.02c-.525.457-.768 1.343-.902 1.02m-6.077 1.415c-.879-.063-.898-.823-1.02-1.226s-.85.765-1.586 0s.172-1.771.01-2.376c-.162-.604 1.736 0 2.02 0s1.051 1.248 1.252 1.227c.203-.02 1.293.987 1.293.584c0-.402.166-1.088.93-1.168c1.172-.121.121 1.289.08 1.838c-.039.549.891 1.504 1.232 1.907c.344.403-.867.686-1.07.443c-.201-.242-.727 0-1.172.322c-.443.322-1.656-.443-2.221-.685c-.566-.241 1.131-.804.252-.866m3.141-6.354c.781.269 1.225.51 1.609 0c.371-.492.654 1.073.385 1.502c-.27.431-.781.324-.863 0c-.08-.32-1.912-1.771-1.131-1.502m1.131 4.859c-.268-.35-.295-.752 0-1.047c.297-.295.201-.644.729-.751c.26-.054.295.348.295.724s.324.859 0 1.448c-.323.589-.754-.026-1.024-.374m2.205-5.969c-.012.074-.061.118-.184.106a.6.6 0 0 1-.236-.095q.21-.008.42-.011M25.389 5.15c.619 0 .539.418 1.051.719c.512.3.242-1.552.592-.854c.35.697 1.389 1.664.889 1.851c-.43.163-2.234.859-2.396.739s-.377-.63-.809-.739c-.432-.107-.889-1.127-1.186-1.1c-.113.01-.123-.184-.049-.442a28 28 0 0 1 1.572-.455c.058.158.146.281.336.281m13.519 30.025c-.645.666-1.756-.464-2.523-.424s-1.152-.765-1.818-.684c-.668.079.182-.847 1.111-.362c.927.483 3.756.925 3.23 1.47m12.93-22.934c-.188.24-.402.408-.607.585c-.605.524-1.736.484-1.898.846s-.566 1.489-1.98 1.494s-1.01 2.131-1.131 2.738s-.443 1.325-.848.801s-.566-.323-1.816-1.853s-.77-2.375-.365-2.818c.404-.442.566-1.49 0-1.329s-.889-.202-.768-.703s.727-.867 0-1.402s-.324-2.445-.889-4.189c-.566-1.745-1.334-.51-2.586-.443s-1.455-.873-.889-1.303a27.95 27.95 0 0 1 13.777 7.576"/>
            </svg>`;
            
            response = new Response(defaultSVG, {
                status: 200,
                headers: {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'public, max-age=3600' 
                }
            });
            response.headers.set('X-Icon-Cache-Status', 'DEFAULT');
        }
        response.headers.set('Access-Control-Allow-Origin', '*');
    
    }

    return response;
}

const MIN_BACKUP_INTERVAL_MS = 10 * 60 * 1000; 

async function handleSmartBackup(env, currentData) {
    try {
        const list = await env.CARD_ORDER.list({ prefix: `backup_${DEFAULT_USER}_` });
        let keys = list.keys;
        
        keys.sort((a, b) => a.name.localeCompare(b.name));
        
        let shouldBackup = true;

        if (keys.length > 0) {
            const lastBackupMeta = keys[keys.length - 1].metadata;
            if (lastBackupMeta && lastBackupMeta.timestamp) {
                 const timeDiff = Date.now() - lastBackupMeta.timestamp;
                 if (timeDiff < MIN_BACKUP_INTERVAL_MS) {
                     shouldBackup = false; 
                 }
            }
        }

        if (shouldBackup) {
            const now = Date.now();
            const date = new Date(now + 8 * 3600 * 1000);
            const dateStr = date.toISOString().replace(/[:.]/g, '-');
            const backupKey = `backup_${DEFAULT_USER}_${dateStr}`;
            
            await env.CARD_ORDER.put(backupKey, currentData, {
                metadata: { timestamp: now }
            });

            if (keys.length >= 10) { 
                const deleteCount = keys.length + 1 - 10;
                if(deleteCount > 0) {
                    const toDelete = keys.slice(0, deleteCount);
                    for (const key of toDelete) {
                        await env.CARD_ORDER.delete(key.name);
                    }
                }
            }
        }
    } catch (e) {
        console.error("Smart backup failed:", e);
    }
}

function jsonResp(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

const TAILWIND_GZIP_B64 = 'H4sICPzCqmoCA3RhaWx3aW5kLmpzAOy9e3/btpIw/Pe7n0LmZl2ypmVRd0th9OTaS5omjZPeZDWmKNBmI5EqSdlyZX33d2ZwpS6J2+2e3ef57cmpRdwGg8FgMAAGA9t2/Eer6yCr/HHtvx7/zsKiGmYsKFgfI7+OZeSERXHC3mTpnGXFLSU+UCUuWfH6JpGJz1geZvG8SDPK9t2ebN8HM5ZTjldmDkgu0uJ2zl5H7vcqYS5jq1dBbgCh8pPIz/xHX8d25lofPrD8VTpZTJnlQrumC9Y7qK0dyndF+VZxZCOkNKpk7I9FnLED31okvIETy8lYscgSmWZnTr+4ytKbSsJuKs+zLM3sL57dJsEsDmWeCoCyvjjKjr6wKnFeSdKiki/m8zQr2OQLZ011v/EBOwbERoLb2eGhzfzMzvya40A0ZVmWsrC7u8yGTCu2REh5b7VeO1URgGwukwHH/YrJoqtJhBhHgCWCLCpxUmEOkaZwV0DeHhsWI5clixnLgvGUU2ftPrkmCG7hcAKxw0NBI+b7VkqdYN3dGXHRIgmLOE0sByubMqgK6fDdtc0c5+D762oYTKcAM3YOD+MDKAAEDhbTwjo8JHRijg62lQ3jMkp24T8AOFDWgTqrOgk6UnbP2p0z7M4n1za0GUEe+MliOh38cW2/ugYiOEAxV9XqAsmzquaOw0OVBCTKBgqZrCriN4jUE9yUbRLPcTPefzN34b+xaUDN/NV8GhRAmVnPsqDENSJzzbIcKAZdmaQT1rO8ZtXrVNvWei0Y9MW1O2ZuVEgwC9vpv7j2axDrr2BUTl7EU3Z2m4Q9aHjOptEwG93dQQV5ERQUT6yzmhXxjL3Key+uj47WjguDZxbnDOqVMLD8Gx5bzVieTq+ZbcBzNEa5v7Tt9I17GUmErEXOKnmRxcARvN2RH06DPF+F0LYiW4Qw8pFx1w5y0oHNqrNgeRb/CTRXn4+A7/WwegdsxYeWdSEyXFRmi7yojFklqAC9xyyrXJJcAqa+CpJKzXL6eiAT3MeXyJc8syXqojgYZHvrggz3qaq4inOJu69a4cporEbWd3fnndR4Spo8v45plECqDvDEMAivmI8ovQrmIv908nQ79kOOldbWH9gsLiSMHIaZIck2q9sxPoeFG4+QVs5GZhsSqsTczvrDhEFW9k30fDkHyTaxUSSsxJiTdaHgibNbk9gy7qH/DAhXTdIb2xncAzkouYEMVCiQ4a3nCKFQ6R146w84h2TPdiGJxCBy7WoCMMGBJ0W7qICAfVOw2Y8YKrdUNGfAIe6ttKdAzRn7yEGQKPRpLgOspbxSgMwKYyB4jtmwnGaKqowz+v/oyAg88k1+hLnE5BORr8wsJfZyNrhN17yDMwHFWXrN3qVvWcgSE1dZXneRRFGgv/7yA5TIYpY/zqHsJE4ubWclpwuaNst4rSSb+qxvkAOmfLvAmWBn90J+3r1Ah9uYTSfA4evtSsLdNdwP3Jp3puIxjRfwJfV4YVDxPl0P1JHAFB13wFNpAuRfYHLKttV1cnSt16KX3BUXW73YN6WZ74MUG1yn8aRS6+kxfWTkWZOI36LHYIuRxcxZuLKmNQwcg1NUOh90mL7msFZmY0qVHOwlw2Y3iLo2qPwZABt0J9nDh/geJihRXQoDzXf9fZ29t5waFGs1vLYZTSUpXhMClWTB8bG7Z6DCWFqHUxZkdqkDRdRGqVKsnIxAa4APQY4D1Bf/mTmdN3FYrVaFGNsSICMXpeuUJZfF1THrxw9rA3tbbNmF8/k5VYJxenb8qCZJtyE5q/k0DpldQ210N0iVR+UI987ijltWJdZffmS3uRaLQzYSEssR0mf9JQ0PM4+7I9Pw7HY2TqfVGMgZgAY22ilq/7YUHColYbRLuv7DIrxU2/pLwQS4sFTTCNWvGYWqGfUlZgUoXIJFvH7xyK/1j4/V3ExLoGHi5iM/3tN+SNzACGIURka9suF/u2pNn2QvfT6NjaLPjll2CNJE8squwcT5Z6iUrhHOdBUa2nxka94tiSolHDClz/uipkmwxRdVzuXODpYA1UZKr1dBcVWdxYmhzxyx0oCB1vYvI7ny9WeRWKfcRu44MpdNt7TW54s+qOkK8kmls/ITLBbV1HILC2Z3FV8macbeJx9hlkv4mhjB3pRgjiPbMeEsC4QDVMr8iwerbH3hZtBLVk3uIcAXyv2T34ZHx6OBfT45ujuffHlehQ/HZhSJnwP7P+7Ob+D3wUm1YDkCVZsQsDqDhSSIFgHkxC38RwXWcmwNLKsHP44g/9ACjC3XgnV3CD9ARvwbLDFqGszm1qjcP8xBzKtxEk4XExAv0IRibV/Iui8Qjo3NqnxZOfacCyLIV7FBEEH768hdluh0HQEy84xF0/jyqsD606QI4oQhekEYsjyPx/E0Lm4hPE/jBETW82tgzhzC13EpMY9pneDCKh2UBfyF1Wog4v78JpkwbGCaTQj4ZRZPnqbTxSwpBc6KICtKMc+TiQi/TW/0l5kRgjxXNE0DagXOg0TT7JKIO06RJ2EcwfcUmveUyOxakziHTkP8g3zOwuIt4gsh5Gf4uWKCLNA5X6vvOFHfN/GkuOJxP8nPYCk/oyk1GX/OrrI4+SgCX2XUEvx8EuQx0rLATYrvgtt0QfgHc6TbWTxhhDzSDKgxDea5jjibByFvUZEFSY47GK+zmLeXYoD4mDtLC/6Rf2RYbQ7swsxS2PoknsmuChdZniL1inQRXj0ORfQihypB2oWIINcpCFgGeJ0lwRy1iFLEY+CppBRzVqRzFfFK9g0PvgkmE9k/eXFW3E7ZG81SKk7UosLfzIJLjAjmc+jyIAkZMTEyDpJ1DErLxycMWslk6JskF2TF0OOoUOz4eFGkT1VRGfNiqtgOg8BrMvUdm+HWESuXkbEiI3byM5gaJBkx/FMWIB1IXDyFAQfjSQZx4YHFAiSeTqOgTPsdVLM4utWpIkKmXxL0HNiDEYtfQ3slS/IQkU6FAH/qbx56jWzFhzQiBF0eSQTEt6hOhGDZkkWcRvjJe/MJuwquY4K6FVGwZfFaF7q6nV8xot7NFWhEEm3MJeh0A+z+BDtLsf7bYBIvchWUjRPjQjRODRuqlYd048ZB+PEySxfJROVQMbtySUa7zKBuIDuVQobmaCyfsTDNaAgpVFXZMz5WdMTjooCJdcZ7z8BkGs9LEcYI0JFvGbB6uaAa91E8nSLNiyz9yNSHpA/fHH4RF+rbqGCuBiCSXg5e/EbRTZhCpxUxSA+ZGAEHvghm8fRWBERD8fMnKSIRwjtD1FA+0UX4/WOQxUFSfI87tXEo5LMSsDAHFiVRB9BkhxEjqa7CkO6ErQizkI6ViJRj313F4ccE5j6R8h4IkCFar6OIT23UiFmagsJDaNFQuQIVSjOcEaWRDAOYsmUOnF8TFUp3MN0T0E4nr1ISV7N4aQZxRrsKJjSE1LeCtSgQXdk6EVRswIOqMSIsC8NEdSmz4rcZr1tCIYJg5uUxakRNF/STYWcKeqKCkQU51jvJ0rlqA4yrWzkzXS1AeopJK06Q65CVA9B1xETG5nHAuZ1Lb6QYQnsiKpRBs2IZ+VQjIKO+MuqWcV8bOMi4byQuMqIsKKg9GksVJbCV4RcSa5qAafjJM7JS5DPGNRMjZqGZW0W+i0H5uHwht2lRJ5lOn8Ii/ZJpfU588WEMAzFkXOw9nqAwt0amrvwxohMqqXWjosw3lwas9zgDUlXjnH5B+x1kPVxf4fL5DLdfqrxL7BgU+gO+DMqG8Yg+nSqgEAaFLQ4KaZ2ROWYRldVxRqTEnkXbSuzjyF+t+18x+3HkrsQJEJ2m/MBEjh+Y+4Op/fZ/4Ct8IPPy1l6t9XnWWYFcuy6tFX7PxfnaSmyKz0qnjoeHsypLrqvfPj979+Gn129fPn/74ZtnsB48PHwaqaWSzYMgU3F7A49b0imr3gRZYlsWnghCJzyHOQCbXUrNXFgo4AYGrN0lRn/mxiroB1adxDOIIAI9jdyv3Ces1NgY/jyNfNEp/a/8VZxEKe9UaBwAGINYwt/wNgB8MNVyHBc6cqt/h9moB2vODBavrsAPoAwlNx3PsxQUV1A7Rnp5kkH7y/XcsilM9raFEO5TUxbnH3fhi3Mw8LNtYYZ7AJJnYx8ky3zYYJn3udnzf2T2Spz89TI3ytJZD/gg7RVrZ/UV7x5YerH1cYhj5zhjSTBjkwt3ePE4x3XauyCe3sTJpPL07KyC6zG3ck4Fzi8qwBiVMWN4Wk2lKkVKiQUkVi9c6/18AmKjAguArALEjeJLMdgrMD4Y5s7hF/RbWq1XEBng3Ko14nzwPnd/zE0ueMLgz/sc+/4KJtaiZ4kPywUFH5CAGPEhxDWJlHnAk4yA5Y5hKvvYs/69VqtZLmlpEIgi0P5ojdFbtWoY0Y2CCCZwr0YhL2pFp5ZbpxCrs24EhRsUCseTFvMst0mh02bQGHctt0WhdrPT7I4tt02hZqfVagOUDoUajabXallul0Ieq582IOcphWqR16mDmD0lXGr1WtvrWGsXpxWJ3yngN1b4NaJm1Fb4tViHjSV+E2/SmowVfmHQCCKF37hT79YUfmPAr6Hw6wB+nsIvAvw6Ej/P87r1jsKvUet4dcAP1qShxC/Afwq/JvxrKfya8K+j8GvCv67EL/DgXyDx63jwL5D4terwb6zww0a3JX71Tp1TjOPXhX9jhd8p/BsDfglbACtMd6PYwn8GCeFfCcWmQrGB/xSKDfxXQrEuUWzW8J9CsY3/FIrUNoVigP8AxbxIE2YieFpCsKkQ7ACCTYVge9KYKB4MukH9lCkEux2vHSoEO61GkykEm81aI1QIngLuTYVg6J0aCIaA4CkgmLGJRI9F9aiu0GMwLOoSvYiFQRhI9KIwaAUtiV7UxaZL9FgESDQlepOQ04ijNz4FJBR6p6fe2FNDpBN5wNkSvWZL0A+UXtAVJIZR1IFJTmIYscmkpTGcdAKN4WQcdFQPR+PTOpKFYxiddhpeW2LIgla3FkoMw3rTq2kMAxjTdYVhWJ9QiGPY8Jo1HMQBHkBoBMdMj2IWNcKOQnDC2l2DhJNGc6IRHEfYUwLB1imrKSkzOe10apqEzVYD+k0iWIfyTCHYbbRqkSahF9QagCCf33Qnh6xrYHgaNjQJo5qB4YTVmh2FIawHvJbq5GDcqHUlhiEwaK0pMQy8dh0IIzDstpoTA0OvERkkrEO9bcBwGs9UF3eA8ToSPxZGYTiW+E1Oo9PTicRvDOzaNgYxazcUft0mYKu6uN0KGrWJGiOTTohU6gqp067rLm60W9CtEj8vqLNai+Q0zI0SwVo0wWHrCf4Gcqouhl7sTNRE0m3DXB5KBJvBhKFo5gjW62GrxSSCXhsYLZAIesCQjYkS1G3ASQ9i6P66GiW1Vp15SECGhkRTOZCBahMUfQJFLwqYGiZBJ2poFNtA67HqY2DIxumpRNGrjU+7nkSx1jpt67kOGKPbUn1ca7dIcou5rt1kDS2roaV1nEsKpgU1klAJ6jCMxpEn8Ts9jdpaDrYYC7Sgrk8mzbGa67zmuBuoPq5NTpvdrsIv6rTbTJHQA9l/qkgI8rKp5+ImyDwG+KG2qenHUH8Q+EUgtZmiXwumqVDRrwOaw6nCrz5pMCWna+1xe6IEYa0L0k5NJDXWaZ6qiQTUBtZpKfyAfjhrC/y6oFc0cSL5eKvJd6rRYzWQ2gq9ccDakRoincmEkBXd2x1PIqXK1EDwsVOFXh2GTEeh12ifBkpVqHVap12FXi1sBkhaiV49auI0MsaTd0G+KGpr/CZjZpBvDIIZQxy/00bYipQQbNeAuEpVAK2rHqnurYMiw5Sq4E2aDFUMqWo1a6gCCfKxRtBV3QtqV6uF5APFN75MJYY40xkUZB0McQzDzqSuMQxa46amIGghoaZgu9FuR2qAgEbUxmEmhEyj0cX5UgiZTqOGGoYQMh7om57CkHnjJioz1zEsswrZx8hmGsMJO9U0nEwmbY1hCFqepmHQ6Y41DbvjVqhp2AkbAVNisD2pdydqImmN695YDeFm6E1OWxJDkDEwwgHD+SKbTw1lpqUxjBowEBQN2emE0oQy0wUaMolhWOsSRVtCtWm1oo7E8LTRaDAlBzsMZIcaxG3AMOhKDFtdL+wqZaYxrnXa2MvRIrzK40CiCILaQDEwUYxak5omYlQLxrqbWbdzGik5CIIFBLma62p10M3UXFf3wkDNJd22d9pVjNipeUFHEbEJM2QT5cw8Tj5q/OqRnothIon0XDwGIdRV+J0GXS0Ho2anjp0l5uKw2T1VA3kyrnc6aiCPmddtqankdOJ1UOfg+HUbXrep5AzA6tSRhFmaG+qWZyiEEWj5bUMhnCAdpK4QNJEOUpvpeF01F0fNRqSnOubB4O0a+NW1vnoKukFDyelu12s0VBc3w1rLQ0GD58p0HvgEDaDUxoO5Orau61VAm5bIlspr4WLZAjFqrYXxBHxzeLBeneE22z5wjWpNgpNZBTTU7jU8DHGIRbZg94Qos3KIYkmjYIowhxqm6fSeUGVWDhUXmgokBjg8FNr3hCezinbT6Z1qN4ZoO0NtVnyN21TVapVp4xFxWLzSZt5xUimcbLBhij+o2jHuUeF+m1/AH6dfsgzfeQmAG63g7tZ9AK6V8TfuTjzf2MbTe43yXH5zF0cdq4sj86yaz6dxYVtDy1E2G26h40dGPB7lswPfL5zN+wAXb4LiCi3/4+Q6mMaTauXrIK8sknEwxbPDSWWcBeFHVuQ92r+50Ebsop6T86o9OBj+dj4cfXk+cu6G58Pz0ejkUm1jPgGuYEHCd2V+ife0+4aV9lhfxtVoAV9Mb6IxZ5CJSLQhCKZTCwk8EHGD6pCNBoPXEf0ceE4PYLAl9EaMx0rBdAOSmVSGZ6ZsQz3w9Dbku8jYhtwNcrCBRa+017tR2WC1VmRj/qNPNABtQ8y0IZk2SbzeRoKJdm3Mqt3rw0PCXzDJo5q0S+KxM7QNwy1kuVcJbF79PY0T23IrltMX23+WicVxNA0u82OW4Nk9CP3hxS/ponIVXLOKiKuY2SsRw8MBRrzF1heu9XxXKo7Z0kZikDG6qBLi8Sqy6G0lZzP4diuz4BayF1k6WYSsQgfacXJZCWn3P3crAYAIg0REVIICYm4reOWANg6JR19H7svYDYutLWTaQXwd+at0DiXiP9n7JEbBFUyf8R3UHLgDhFyCCyNIxpOpOIohR++g5k7iHElAe4vimOR9gcYiMcuf3AoICCBjaCRyLQ/CcYCWMqwBPX/Fub43tK6QCq+T6e1PVyw5k3d3uEkCWnCIgm/lwZU+orkXRgToEwhZI7fE30NrL3XwUGsHcaxRSYy/IeblpCcrH1AB8WbCQVYVe+zwvSEdZQqMiwN1QUpG6ktAOGpEJAhDvHEjxeoBich9ULVJk4ipMmjZLY4PeU0AKsnp6MQaHNR6ColiUM2CmwOVeHdX4JgHGDjdqYtKZqTO7JjXRO7XHKRYScKoNlTzdMYQ44MhHhOy3OhY+ITqQdAXJSsY4wQDaHAfSlUJssPN7zZi/1U0K+G5SbyqaKcm4oayIIgnzFa3yjmOcW/lwLypImtds2nOKmRYvKNWIXrVbbRdiGmYn26K6qi/3BhV8m82x6h5f4NM9O7bJMmQgMqYqw2W6u+dubbuPgLG4qO2VjGODbqYnLBInBxP2DxjoTg8HlrvrljlglIuTi5EPReVlIzOcj6D8SljsjUbocZate5zXsWmeDKNmconVq51VRTzvHdyUgjAYZ5Da2cnkzTMTxZzNLFhx5eLeML+XYJmx/LEMYcaQxjPI8cFpSyIGNqC+VyAAiusRL5e4VIDe7ErM/WStZ9Jha48pBNnkGwcbsOAkwWdQaG+N3LFZq74E7kEccvZRaQuNhxh70HDxtM0/LjRMhXXK7AhW3Kp4JJIiutYiZ7YNwSGtA1WKo0CeyyUYsUhKkXyhr4VkIBaAnXisOOQ8892rOzAErf8O8zKYZCh5dExXU2knhW8LKihRgQaqsZLc4ANbMXnlHasUqANOw5lkXtdYH3KfIG6EWpWdM1BljSYW+WDQbCD0YHHqSQnwD/G8qIlHLfjMTsOdKuI6QUZLMvpqYD8GAwsy9WT50oKj96OAWKMBpyERM6Bljg9WqZ8RiFyqI9ozut9YhTuHXoxDITt4SLncRgkEtQmsw+K7RGrihX7ig3EpD0Q87QccmJC0k2oiKEnNLKBnLIGIkKGe4raZpaNea63BaX67PmLx++/e7cJTsbvAmuU2YBvlBL1KHkjcqRZrqqSYkcnmbXtLikr3FF2RQQEJX3tJv6mJmvAE4YXz2VJrWeW0drM1ydo2/jth7eJ7GZORBihgialVod2LInoJ0rmlBUUnaPoS0VhSwQLlWSltLW8l7uKWr1gTcrcYDhSt/FTkqJOPExHfsABG9Ur7VdqvYeHQtEBaRlfJnbsFmqbIuYCU+oin+BmlUdxhS5lENvMtqXq9HZA2+JrlbSLs3eW26pHldSc1t+46FyaFIx+6v1VSrpEwnX5Asamxm+okXpqPTw8WdnD39zRlwNnfXLJL4jgnCynKDG9Hl9O0/ExbjThqmR4gVMtRlXmAdq6JpUHqz9xCbJW005pCivPQcZW1oV7IeatuMDJiIPR11JM5FzrgQe6wHqvXdHFyOnTfkJ5I++b0u2RsBDbBKUtPSZ2Y7b8gRQpN7cT/iYcdDUx5J0idPeR1mvFvt9ObyPoN0OghZtj2JV3d7tzMkdkIPRfFnv2484KY2tr28iRtocYmgvyW6pCISmtTQVPDQQeuKf7nF/ikpQQd7rkdpNNN74AGfg9Q04ZAWhO5p/37Rv+XpS24FTfnp+72Knn5/WwYvG9x1933P/5KXeflXrwp9xfBXghkg4Xh/Vmza03u2691Rq5QVLEfywYt/ca1luQ1Gi5dQ+T/lgEvWEN84m8EDELoHMhp1fv8ASvDgl/0rYNAZaZxyy+pDgI43/1GsTF+R+EAWaqd13vtD0SdmdQD/yjUBJesUkwnaXJRGRFjGoIk/DHnLwKCIrTvqHX6LrNBkBFiBleGht67ZbbrMP/IWaRTW9v0hQB1uuu1226XgMghKCQFRzqacv1WoBSG5CAZVFWZGyRGw2l6DRMyRZuWPdqrldruQ2MTtF2ijDFzF0eleDNB5Zx4F4NsjdPoSUdngjD8aNoHPYEEifM4lmeJoghtK/mEiJ4mG52wSTIPmoqeI1THiXzQYSOvESz9CTDRvMGw3+eSEKDOSAQ5Ob/yWi0z0A4NeoMEbcr68er4GOMgCGu24ACHR4vjDexQ05NDNMp6JYCfreF+d2mKCJMkzgBm6riNAuvYsS91XCRLWtNHo+GVgK6yJkTswCABiACWb16XSSwQFTpAW94XejeZkMkYT9ySnbqbtvTmFIKJ1Cz43ZO4f+lBLaVAOP0j0Ua59Qr9Vob/hMpijuhkyGJyM/YnM4uee8jX3R4bP7xVnatd+qJ/o5noq9qLVf8J2LZVmw6uZQM10C4TQ4jijM2zmIcZF6n6wIbNICUwJ7AtmrcI3+hWACS4j2qvBCEQ6YBWlMJcShMucUQvAziJB+nWSrYlv8H8VdpXkjgyOFS3iBTivo8GlQGl9Y9HH8wqKD7RKtRSPD/Rq7mToipibAwyoKWNWiUIDEFbcyyV2nCbifsxhBS2NSrtNB9QYTE0Ys2DkFCfAZixz2tw/9H0vJh2GkRX2O+6zS7lcQTEMW4oFqoEyBuGlwzvFyCHMqjgdY6Gnosv5LCAPughWk3iWTdOvZjHVs8ZcDnMCqiiNhddhp2Ph3PCmGDpPDaWJGIlxKqWdMU4QkkN+pUg5AwFK86RZKX6sH/PAmTdxCwtCv+U/FiwAHMBg64pk7YWcDogC6I5tOGiFejGlPaYlTzFDWsG1AAWNrrSKzUGPJozmgLSlOSHteeh2KyDcKiUU5kuxMLxqaStm2ctYDJJTKaQoIL6tTgGZNyu8aDAmPeXy7HKmGJIC1nl5GrxKcxxmDKTdOEMzTJvBmbxItZaTau1QksEYInG3Ml8gePVDK123a7Ld4JPEXYpEC/dWCWAGjeqUzS5MZeALnneQ2VpsWoV8dpgHpdpc5RE1TjFlvqtZoy1RCbHUT/lMt4nsglJ5f1p5CCAhprjSeJ5vQ6khzRxYSkQEd5M6Fy8LGB8XlxS7YYSuuo15EeaRgGeZwYykgXiJEE18HvqSkVUV3oNCjlVsy6OHxggKBShpkaXMHB7qNZToseGTPJgjF2EpAWFBJUPEpzXpuYhEdxqQOxMNlSJO8wEo3ULUCheTBlptiEYVankVATaWIIgtCot4BwrTqPNwjudVouL9flaQa96zgAoC6amObBPLgNgCBzqYthZwA95iwIr+aLKJLSHCnYwvhsweUmdJjbxpx6gJ9iP2PUdIEdhb3axhkDKD9PbyZKXergCGtymirOJPYn4sN8xqD7VApwP7WzMXIV/WikQMffSm2Qz/5cA8jS20CM6DYX/MQUeTCZTJksAC1FjecU46UoEgIUeyEPkokEXgdp57WbLuqzerg02zR3djsUmV+BpJBivsUpn8csSVBZAiqA8EPJD5rhNU4VSCvx38jdFmvIRObgg7hTMdRLgq7OEUYpXJJxZnyi5ZeYmrYGLqm2EK8lYYcmQT5hFjSLeBTiUx5ZqQ6N6QbXncWUNOc2V288oFWRzoIi5ZXDKO8AHxhMCgQlLqhBealJ0ZxCsyhE3lyxoBADnsbp6cgtaTRiTuN3jmfpR3NBgsTeFN41GaWGUFOK69J57oMMnVRMU5QrzD/w1tK7nlw0God3Yh2Hy0ba4/KzKqTM8AAADSrMOzgi72pG7gizy7Hl0iWk3tCqWa74D5Zb0/lV0IPPNQHEHYSf8r1lf8qH2YjWorn/KFfrc9tx1sK7j15i/nnt2rkbuKk7dUNctFr/bkEQIzAKIgfhUdizrJEwm7AcXOYW4ZX9+zU/2ZWntnubAm3N2TcJrIWH0N1e23GNmPpWTINidjdAUKIYNkcD2yjTpDIn0KOOkb3HNwF5q2M/E4i/v3YGAxn4kbci9kut4J2HxRJ/GCOSMeIVQ0WjTZOgnYjKjYxEGKYA+PrhYTKsjao5urjIf4qLKxsdhtiWM+BEi5E8gmaYU/Z7AvHr3gGD8gIakLxxdydDDxuHhwcJPxoHPE5+A6jndvXLwbkjHZrkjjPAJvW2akpEJfGwNRqoFgyqtrPWpjhf5TYvmIlSTHbEWrnbU3uufeOGKfJBYN3d0fcVyCNrQI5a7AcrZtjhrB+s4sGFW8F7cxfAbGvnoreZT2WrnJj5aFPk92sXGPlx4X4bu39E7tPCfX/t/njt/lC6O/csgj+/X/snv/27PQyOo/PJaFVfO/f5Hjw4iaEKs6jziQ/K/rjwT+xBr+R05j8GJ4Ajj8+/dOG/u/P8yDkBrP0TCA3dkxH8nEAT/BPqxuNjyDv8reLgFh98ujp4JzKI4LkDnXwOsN5f0yXRt+zy+XJuX/xmYycMnPNz+xxgA0kfF1V+3Lq+e7B6qgII/sHq21iGP5HTGfzlvH9E98qLKJ4D41440IEb7UAG0u0gqI9L2E/Y5V0WTO7w3O0OmdAZ/E9uoTnBfMvk9WRjUvG3jRkqmb0SPgXIk2EPb0fzIWjOUeRyWZ4eCNk2KHo4kKvVaiyGL5TVg/wxs1d8dGfosJYsQGGgX6MjB3S1q8f6cCTvfLOScc8OdFfDYtSzPAtNWndsocZSeA5z12yYrNItNfUCxSWOfbeC7pBwZ3UthDS2XQtdf/+mbalG3JpNqkQLJb7uVegvNEuQXMrZXW0gGfZdVjLVy8s7xNfCslR450MXfPAn8WtuDtqIOtYI/Fo/eJiJiaEfHB3xIqmfDYNRv9CzUe3wMIUfBvMMzB45usPWiR5IbOFRD3SBI5mCm+5otQntmy/yK1vmgbbB1Jz4Rk5AKx8ceD2swzo/t1z6sGEqoI+h/FhZg4IDS52eTVEOHuUMlYNBb1QqOdqVqsCtd6WuLAf9487Tua0MmDdb4OAJEXbDn/vOElhi7NFTd4BypixMldNZoekl/ioLbnrxGggRCyPjn65Bf1H39zeOCR9E1WmQk1OWJfTqQUA+B6yXz3/56fXbZ9iCr68pKgVpk6BdHPrP8VM3IG8EOqPTA1A06UNOAeVnS33+oj+ffPf+rQ6dvXn7/DGUv7sD8LAcYIEBXSZCHyVV9P+hkzgUSrjVsb+IqKWO+tmi0UYiBpuw4L7eqD7xDTwNpJMhyReqlJ9qtYoOx3yowDjrBQxUyE1M2fZd2cZZnPswDmUwZJKeLqsu4b9b+A9bCT+cEvBBGGwrf0o56TE0+DOti4mfvr52f7p2H0TuLyVd5E88Y/v6WnKDPdTu1eR9fviKiziYkomj8FCyoExApJ9AFzmvHJHRuj36Eub+k0uoBRSUY+Hnjju5Ay0QlMBLk5Ffmm4nvrrmeiNQozTXknsDVCJhprpwlFc8TdGXKI9IyrqFf1BT7hUPD3/gfMqqchIxre0N3ff4GLn6ADQ6LhIz1PoMd3jWIpuicqxs9G2IEHqts8M0n3o1Qf1X55P6LxmCvQRBxVx0Q6LWMj1ananzNnv42/n5yPlwBMTkPh8f5UfQuZgDFp52ogQLwNCOAT/gIR10uHlwR3EfLMctQF7qJSCuAX9B5/huZhDzF1ZiT00CH0m0gaNf/RI729ZvBeC6CgXdF2hlyr+/sL7QJmFkPSYM5OtKYTfFJGXREXUCV7FQ1ONXDIDp4xv5kcuPM2V7duFbMK8Jgeq5x3VnbaGmbtazvljvygw5L8iPv0ESJJL0MWoVV2zGYCEMUx865TvWXm9mwdIIRXFhhND+7hgW2sExDa5j4aduIzYTPqk248dpUaSzHQlTFpGJcVxM2TjIeNJyK+Z2K0a6FSzHKm+EIIPGaZBNSthuRGa78ypcN+IFqhuxEo+NaIUI+kILpsfSJ5pw3gX4GjFA5Tg0I/gQQYO/7eI6bRuQTtsCiQfDaXZMPglH/e3jcRs9ZN4BP9wBF9yRj00HBv7ROY6PWEzKiW9ZWvjlwnEtzMM0Ip8nE1vJp2AYGKxa1qniHTqVhGpHavBG8uISSANur2lP3DmM03gYHM1xWE2ctTstFUVgE/T2rXSCK9QJRMoY9IcYtYLXkX0FilZ/DHPcsXd4OH44gfE58cfOGvPNUc8QKttEN+nIn+uLVfO1G/oxaoIw3lPafoDhmxz5U5iAHAs1mpGjbKAKPjVE/qMU0BRu0SMfrWWAahOMnjhOH4pHoCT6kaqHm1uzcvGBqmbk9FK68SWjRhg1tI4scpJkfQn/nZh2+yHOE0PQAd2NPISwzof+bRHmBYidcF256MF3uFYqg5bO+ZGQ2KaO8HNeEsLmVMVnIp31VyPrQZx/H3xvf0/utHGOvLujGVbnfpWVL1glEwH2P1C6Iyzl4Ronlq3y35fKcwe3d3el6Zpc0w5rx6ejL6v89wj3CdjzkU5B/7arn6/XD/R8vo2qqSf9yifyEiqRlsqgEL/E9u5wantQcM1Km/0oc3YF6okBSu0Zcb36gxo8MIjhv5d2DOr5ro2zg1oPVn6xueqVBjs2vtgAikkPJ/wBe1QrXXp7sb9296/UDkyDVyTZkn6GFpsyvEKErBrj0R5+hFma58dRMGEq+hj97gPr0ggBnaUEPsENhU9iD9VhN/kv5VNDyhf4t9fcqbABjlxVabfCB7K5JsDf/6HOKJbEMkgL4Fr8eYU/n2nOn/9QZ8SG5lQh5RI0ui8s3Jj7zfoCBsC5Jw34ELWT384nOoyrVYnmDhzfl1YQy62R8aOZHm+nf22mJyqdXDpfuz9cuy+v3Z+v3V+v3W+v3WLpZks3XrrJ0n2ytS/Q/yWXK4ivrrlCtOFoWvigHvV/MFcY3GXrMd4TxGn4GB2WkTYiwnmYkhfe65jdbOVC15jHdKZIXhDF1CwS5UQtAEin0cc83owpsttjYb6rnMiqukyPxWZkCaENaDhhvUQqhKj+zPDPD7R2wnzod3ROTniRNmxGV8SQOuTYksJT+qS/1+iw8pq+OEmvOU2vx4QD4ktZcsozpe8pfU/oe0Lf4R839Jd/x/R3TH85UPgFqCPobP+Ctg1fXovlyB3ORxf9X80+Q0+k2C46IsfOQh+m2OZvzVxbmtMONesTStkndLlP6WubIAGrYmlixRLhEZM0Wam6Kl2VlFMolJmFclj8RqR0J/mxDMzSJJUehNGPNb/tFwVJEeSoZue3ecFmxwuk9iJWxfDTBANhExIEyR0r3TMFrrsiHkl/jznsyzxNLhG/2MRvuTzOZwG549Vf8ld10zTIyE/n8lh9mZ/yG4AnJnCKzSRA+BqVtqB+isw1EV0cNnyBjvZJTr09BSkFl+gba2e1VWzsAeIDXkqexsPaSMhYdQQFOYxQHQVoLKqEKQ3kf8LlP/4kdJV8UaSkc5HUK1msPsmESDPb+4N0WVq9CaYfn/J7RNQccR3Qh/aot6pw+yXHjT785bH4MJMR9H8vSmGnpP/9ImpD/eWD8QaAOjNVK1uPdr0PDpitb9W+RNNuvcxY0vbIau0aD09kpHbHaotKFl3i9INJvFaxaiF0itKettigFm8CLXFbwzikKxJZ54qULzRbLXykMKhFdFwtEBFXKQdVxEh2vN7/jnugufMb2Pn37JLuCNH+e45XdUs7ODDtYkvVMt6VsPFlLtEAjeCHYq+CPbS4MwClGo9MdfulwfeZ3iaFBRGsARxyF1GKHFr4PCMe+MqFE8Bz9Rs92ZCJreERnk0O2ZHeRi7E6ioWv8VDfFnnYczfi9ysHNoHjfYxKyiB8JupRdBgmLmcoqMetRzUEXNrZ3SCKyAj01AvAxhdgqQA4OaMjEWK9KxhnLmoiwom+Id03HBM3fHIchT5BA02DpEK31vjO5B6jVQqD6ulwvD9obExlZqXdmmIGP0XqNGwkhflntJ1B6h3tVamFCXG3BolPxflDHTqNYzdZOQTf5Qv/vD25iazx6PBAIdYTDc6NaLCSkBxR7410uzc/xnP0N0PtJP4LbNzF5qe4J2BKm1N4fUlIifUk4y2AFAJkVXmhHyOoikfu8bAfRKZoimVBFTELpFCZ/zD2EgUG4RFwh8ZU6AzE/J0aZ4r6QFjPGhF3D0Yim31rMSohWbUosyoLODnmW4sbq9eCxHCyHuNCKprVcjOvRwvUWV0iUps0nybD/MRx3+Dc+I19XiwySfDwM1dXACO1lyiyvfckBeMXnchYzryof25a/X4W5YHJ78Nz2+OP4yOHsh1QeA4qZ+rLZHAOG04+DXS4y2QE8GQ760ofySwwN+ZDbrlYvhgla5HF0jFQODMZX+hiaeWd3TrNZGjIe+ru7SS5F8apcQccsNgbbzbXQUQIHcDGjv8EBd9ElRnMv1A3KSyjTiawpNb/QptKU3fmbGDw8MPSLq7u4B3tsqGuxswmpgbyF5zTZJSFQgh9y1x18sq5/hUzbzVU99IhOERwLDn1jxyZyDwpz3CD1H1YSAHjnpRizPidIMRQ2TE6QgH8U5GDM0Lh/xBp9CdugGvWbpk+TZ3f43cF6X13K/okuW7TGpAX2Hwq0hewvoW7/Ekt70iEXY3wdJdZNMeDPOfQRzRVgIGXkSOyxkOQ99nDhplovot0l9hjFg0Yfh3zJ+mHxfzXroUDAIrAFrNYfp7SAcVGJ+A0JF/QiR/NA5Dv0L9tMwQu8lUDRYLxnk6XRSMb9ti9I8YLW8b6+ivITqndwIIaQxBEn7/FDlrIJVv+gD5Ni+phj8bE88u84NBZoO0FPeusmDPme6vxWfAGDskmfLLJd8YowPlsostpm5/Jsj5sRQ9UA/IezdGod83Jhi8VYdxh4fwRakDDPu/I/quKoPqFMVjgH/lO6bjxVLhKLfwCrroZlNkz8gaLTdunKGrIRufgqQLrhO09vAfARooT0CIJLiFrfFGNLbuew8TrDyGCSJx45HjrsyJJjQqRHsIs06cpr7O+euYUMgVKBCOhoL7rVbQN+/yEf0yXKOUbgtrE5VyAcYLoPGDKKrkMifgaFcZCZpplOZLWxKMF9QzNNEuc/nTeo8OfsWrgHjcyff8fi2cAe/kgojmfhvheTkdOfJ4iB3yNG4KGfiPoH9hnoA8DmbXxP1ystQKMvleI1dphrEHSF3xTqG75ZKtvMw5+Y3OjNFGCQ3S7OFvJ6Mj58GJq+0nC0euY7i3HnoQkb+oB3L9I+pI/YBb1fi5y+sNjH68MrAV5FnpYQOjCJpTqFm7BjAzGmX9QM5K+UN5Ett3Aj8YJsP86AjtJf1fhVwXVj2Ga5f8oW8c3w4CfP03cHrBhhaB3LVpEiTPe35G4FIvAp0udUVO92c0U5AjEvgpcAZnmLkH7VZ3uGXJ8u1kGHKkF/YYdXYA/L/xkoYcKJxUNjriw3aiVz4UF/FINAU/xRAy9LDQ2DMwDtHkQxW4muavKeK1VWFJVgyq8+niMk5ynAP7xiq/hmt+WRZW+auk+uFDnL/mW3ryuRLsAD+xaW3EQeOf0B4m5MsBpk30EjcCfdHB4a6xnRlSAgtmI9H6t7h5JEnwK1fi0VwtY284oiiweh8jftn7OjIocHkvmPSeJB9u7tB0Q5cEBgF5M2A2XXG/HPi2fDzDpXKQkNuznM0Dev2zB0rlWtH7TWSDgBMdDfwPcgMEIpPWQ3hlnpYR6DsP/ueaDZuZGatGCuQTvdTDNhrAjM4DtuRTAt91iQO3CE0FhDSOJWocZ/jnR9xafo5fv2DCN/j1ElWRnzH4IpPaShagq4XA5xaDee89KN1ir8CYWHY/CcPwSRiGKzx8qXFjHhCbFPiy47AYOdv7E7gQH14ckwkwSBxkH+J4l+6102OG+X1QkNM9YGL40dnAhkz3mDu8yEO8HyBq7SFqaz7Q5FskWeIvbTtquFkoSZuF6plM5ThlOHKBc3J0RTnkN0Zfkb087hwGlssZZGU8IdWTXJOtJT6ZbXGqo268QK+itLEGCKnd894qwdcTLPxrufk8TnoW/q14eYVv6YJ6EqGBESRD/GXPwr+YHC7GoAqO2Z+gP8MKr4L/r9bRWtEssoAFEZTBn0p9s1C1KYq1N4qNUxhVUI7/Ym0qbe2i0WdvNV7kt70v8K9PDl6tL9zwioUf2aT3hfhQCcL1H6TIL5UEhA9wZ7f3hfxSSVfxZMKS3hf8V0Vjt+RYQHyoBLT/SpMpYCW/jKQ/Fvg+LCbxL5WU05uKmCS/ZBK0VD9KCX2te9DN/1gEGdDHq5xUPMvFd/sgzWtDkFyFG+9hlfkis/mrXI67/UjWdk79fpbOL9/P2sqtXvbSedXDWluZ9XNfOrd6cmsrt34QTOfmj3FtZRXvhel8wtXjVkb53prOKd/u2sqqnh4z8uKjXtsZ6akvnst4XHAHqcSo3HhfsDwa1VuDx0V6XFi9zcMau0grRTp3K3iweXxc3KiU4xwfJnScTRjZXiAV6ur7g9oD6S9CGe8Bw09+/jK0TwH7C2Cmn0QKD6PuD2wPrL8GpJju77fPQVq7W+9afmYolJ+eBEFL7e6p4zh+WtdTp3aIQc8SBmT4I43MeGSldIxHxmoigU77qI976syPfjUACmoIPJWD4EkEA/706OzQbCy+RVkWmnQO1pPHYeI0rKeOxeiFhay3quH9OZcPRJC00PImngpLH0RWF0OzCYjbOn5NL1Hw4tdy2rPqlNeqL7HLmjUKNCjQxhSoQ79K+pkZW7lLknHkVrxax0e4yk93oW5cet/0Uz1sPKAqxQ2hiQ2tVb16i467VWthSucx2OJatdHhIWx1rcq/sd21qkgQTfd4gDfdExkjvFhmncL/DFKItz13EyMXD3/qFtJrk72Vws9D3GuiDXXoAPxtij7r8t7CqsQLmb0VtbMCxSqQtVKrZJdju1bBfyegiNRajtl4ytfYkc9zQG1RUI7xYzODIFkFMKm092VCKAgBMx3Xd0IhUlc8aGDFa2G2xh44qqLmTjjUTZU6wqkTnNYeOF2sCbMdt3cCEl1c42BalNPbxr2OpIyTBMcc2Y0aTd1JdmPuM3rsczOoVl/EyMXHDKr4TEgLfvmjL/CBjx5gxKl8tcfD3xYyZw2jPIyqYmSdIusY2aJI+bIPvrGjH3Ddj5JY6dhyySM4Wj7Eh2cn9KUe4suq4qv0Bl9WNULCFxI6BoVfcZU5q9KveIUv468EcP8oGQkL/rxcVsUf9ZRbJl88EC+nZfxVBbofT5tt0gVBVuUf4v2trEq/8mZ0Jjylc48WWRV/hCMWrBx+1ZtJWVV88cvf0DD44R6MMnqDkp7eyfC1CO7ICZu5YNKvCh02wYe86Z1V+Ye8/0+e5uBDuaFBx/n0xR0MQDr88Gc3oIHws6ZOwke7yzOER2yBUsRyGz2rwSUJsFTPAiZogxAHtupZHS5ZgKNAmiEbQbEa8hD8Egfh3EDSL0fp15aCkUJdLjNzqKRGnyiQ6k0lY+tdJWAbdSVfG21Tujbrpnht8hJWk0ItkbMlZh0ealOoI8p1KNSl+tdyJsQn1ngAuW9VGo1St987xtSQ+vTooaflyzSXz3FaE+mBnZbmKDXEh+XeBPiAJf6FyZ4t8X1K+Av0gqkclsQpWvlcsSloAfgXGoieUwPkTjaxeqWQW9KwqbXL4njGkoXVKwfxbuMlLvEAEfGFyg9OYfgXvtFc8yqIUaeQn8Yr2ceEY28j7AbTOACQ9INayPwW653fEtbHuLYgjPkXDuYxPS4y5t9jWoLLL3qYfXrMreOsnhnAtk2PAWk6RTEDoEalNzrFCAAGOj7RsUzHMh2b69hcxxqQTbgGiMSAkRjZEyN/buTPzTqN/LmRnxnxzKzXQDLJTXxMSGYIcTJrN0Ou9Weazo5BV+ypLxGXLgoZiZ9rdxLjonz3TGG+TO+InPs0t/K79TI314J25+XvcUNO9by2qfRsKyEllWdo6EY7Zv69MNqONULxNRQKz7aOUutwAPWd0DkAEHpDqet0t/M0OYTd8D0EsJwSAFJyvB04NDgEhL2t/dS6CKKs3dR3KElaV8EofBW3hg9jxSAZNpRYU9aUtXuYgaIpW/ZWOGdUvErtPyyxRYchLhnFtT7qORFVEsoI4EmQx/lmtaZ43dCjXcs7qeMsgRXCdwO+G41qg/6HUXWKarerbfxfh+dqQlS9xZObqnSDvjstnqeFeWo8T4sWPzwPfrfpu0nfXVFzm6ZGo5o6RZWQaVBUS5RubyLWoqiuWcI78bB53VKLKKpUV4PH8TY1eaBUc4vHNT2jUJvHcXQ6ImDW1OVxJRxPeZygUk2gV0JZ4Hxq1MVXSjCp/oclOOWrDMcxn3314kdwwdlVRm+e7UqGKe0FHdCDFAB1EsbHprWraRRrJnxhPZ6DWlUhQVV5TgavX0DsGbtMWeX9N7ui+CtRFPd9WqTlsujsCCALFETtX7E0u8Qtbesp6JcZfn1hvQNlMq98jzdX0lmQADweRVMDlkM3XUnKIZmmumcvXkHo+C27XEwDnI1fsWSa4m+aBCF+PKXX1nHu/cL6LgaFljvSxWKE9tN0kcUsw8qxWg18xInJ9xWWSEi16F3h5szXjG9l0NJ3PUK9DrN0d+YRq2rINg7QoZFYMG9kknlILnpqcb6RqyOzkfSToPfm4gJuqFblpXx1makhM+3Ev67x52rnUEVtZlT5WjxfYwdylN4W6buJSlk6PEuzujdHl+do70s/5end3em8h3/iMSs0qadBaHH/3VPRJIwQ340abRVlMxTTTQxwy26UEhDI2SzGt+tRAtbwVAM/OwogD3cpiT+xfkpTyWUw395aVhJcbvHR0DrDbb79S9GtvHJbDxY+FgiXnkXCrIVfQkLhp8dlNEV7XO5TvJDvFM9lZ4PiG1zWU3yDy1SK53NAk+KbFN+ieC5CW7xaim9TPJ8n2hTfpvgOxXe4yKV4Lkm7FM/nki7Fdyn+lOJPKf6U4k9Fu0TDUKK66vRhW2TKDPHkMcyfT3etEmfIFqXLxbNg2StfMI4yygJxeDTmRZljQH2b3vyTIDmSZYDIL8mxh2oyfFTwnIh/yKS6TKrLpLpMasikhkxqyKSmTGrKpKZMasmklkxqyaS2TGrLpLZM6sikjkzqyKSuTOrKpK5MOpVJpzLpVDW5ptpcU42uqVRNEU0SRRNPEcVTVPEUWXBOtviR27FXIv3zZPJfuY/gAQivUarxDE3i/2V1vkXV43+561/OXUD3fyVrQXX/Wr56x2Zz3LJUUrZki7AYYx4gGf8gTIR7Dc+tlCWhQxiK1PqO1IZKbexIbarU5o7Ulkpt7Uhtq9T2jtSOSu3sSO2q1O6O1FOVerojFSksyVHblW6Qaxe9PE0wbwfFyj3EZ6z/7Z7/Qd3DnXD879JfljCWzC43wqIQXrXNr6/om+7jTkWALuRORIBu5N5LCcONaNN5DCzPlXUK1yYn7BI3v1Fzps9GDRVk+mzXkCD0iYdSpyJvF4VllwJrl47K/vu7tbwDwa1q9mnLH9ltlAWwPO+tyIJsBciu9CtBVkbUsRvUdODdNbckW2FNwNCkmpv5STW36zAKxLk1ebRdC2OyFV9ErFRatYWJwmQMlzW7YNInirJf7GNoOMBWNnDv8NG2S2mS2rM2bNTIt7Tr4ZgTNRtguTC8Jyj0PF2tEyhAmG7Iq+PvVYHDGU89jnFLFpenBV9jYrhOEXKhWcPATYzmgCoNgxmFVTAv6ESfzniMla4Q456qgB/X5MkCLRnwhF/XRMc3eCNjydDgodrGnNyFhtAH5Gq9Kc/8W3p3A4Wv3GXo6D0IlKv8IOpU7ySQwJS7BS4+OnhW3E7ZO7xlU5p48MHAHj7mG+LZURgTnuLDLLltULVGf/mXwJ/3H1zA+ki5p+gsge/VfkYVwjqWX+8UzZvj1mzUf5/wggwbhwmmfSw6/vwc7v9zjjJLZPxbBMEzP+Ttdgs9P6BJr43tph7J8cEsB+Her3//G/s0TnYcEH0aw79bF79S93+ptZicQuSpNpefXBbVyBiEojw6wyZbKPhocaMoPrHXqiAFGhTVgKgmRYFIaFJUs8WPymsoRlsU1WpxNaBWhXVTm6LaeJBOUR1+ol6jI/UuRcGKqktRXWHJUpOmLDXTlgXagmd/vVUUZyj3j9HKCqiNZ/YW/xZHVv/wig4qXhQkIz9tFCNyvY4iVG9W0mLLExZcey23RDlh9nXvYvNgMtmyKisxP11fv8K3MrLPoG7k/Lx9XSYfnt8cfNvmfGjjUqV9YuvfG+NuPWpD+a1jQgTIqfYZNHXGv0osKrmrZRprzsIcOdVYgd2mSV7DNMn7fOVbqjOUoA8swjVogMn1Z+BNnoeYjz5xpDVbn9appQH3pvmKslrZNlUpbQ//F5iUrcWckPPD+Ta3FcVZs9PuKrvSGrcnxWnTq3drhm2p12q0iX7c3uPVTs1mW5vhud98dnSQJfs+fT//yG7+dodBcTxOuweqUjOeLzfMPKst01TVM4xUPZ4krVTr2ki1zlPaImPDMFlt8KTuf4EmS9KyLnMjEfjxlweVNGQWgM1VG5xjBLaQzpWfOlTR4WhCaa4eNaDEKceVhDL/RLw54s0uEpu3AenO62xhG3hFOAF5omFNZaHWqSvzNBw9Qqc7bUudDnquyPCllL9i5cCLGBKpNP8ASOFABm3PJkER4C8aSn1G2GGWZwxfL0O14y9lfoeesbjBaGlPG/2yH+P5H4wu/X1/QYa1oMeXpPg8b2Pez88lmOs9vgNnzpwmzvfHTa5YX4MihCv0TbVMKUXkhEt4j6WYilC2NlQvrmWpjOaNDTzoLCuBMjepfSozVwJLCiHWLTLJyw0Se9Ivn8FSVKhrORfHndYsl+K3VqNvErEt+ubinMc3arQRQ98t/G7x7w5+d0RZ1iA4GCjVK97bNQ3PeQ3/clTeyBcXSuMuQE2efIspBIn93Yq+EXEsY0hVlCEyeJyo0SGj0ZzJrfDR61YET2LZ5TH3xQAlJVNRbmAjXhnanR3zCEvaQv+DyBibQnKkSO8QlsbOcjf3fvCzRMiNvRrds3vuKNLVRsvl93DkfRy00tpTwuP5QYHd2gcqAbRg0cXNBz9ZsUB9unVBbXtd96/YESQXHP+7+fz/rt3Z394RuNm19fC/rPH/EmuY21k3uJ11I7azbnA760ZsZ93gdtaN2M66+c8w1HT69IqupJQvQdNapiedw0q/RZa8w5ALg3742jsd/Ek++ra1Kr3fUadpWx7jcJW7KdaELX4sIXwrDMsvASaJ4b0kG1TFdf7BYBiHVXHZYeQIV2PoT+CaZTl+RSDjX/EnKgAG+gfKiyAJ0QmBnK0Gie308C2awl8BWLwl/oxDfCv3H6R6KcbhantjItlY4otNiE5EQzQx1fj1Wt6hN2G/L+IpkJzlT25F7b2Sp43V9tXTA2/jpiJElA3gIWLHhgvEmrsUEDRV6AMPD1Tikh+oQvlwADreoKfTxFFPfxTkX8n05BNzdz7c90XoJiXfF3HozwECOiohf1vClUMe+qt1/ytm56G7kvdYsNCfmckIf5JbpUz4v6FqfGQOdCqkvHYGNrkc4cncBUdueqPqFyH8SUJV+ftMVP4+K1c+YyLHjLnMfKSoP2PELen0GuQyrDXQChG9dmHAqlpH8gEV+HbEK0hmO/JktxMs5c8tE55+tE+U8XK/hw3tdMhwABnurkJ43bi7y8zRwJ8gNEoHRmnCFl1dcj8yvuGPj7Dizxxu5DKchyAqItYZzNDhJRFOR36iLKaoslQPNawExundLG3DfQyGlHejDL0b3S6dIrsVEqRUVHLNmFXRA0ien90CZzB0cRKS5yXmrNbGA5XETrdLNy1xdYTuWhj+uV36Q6t6Ih3WCdSrv6O99XZ0uCd+tie+2ANmT/wM4keChadyhE03RlgaiBxp4E5L4yQN/BU9+Ilcba+uMhaRJ0uRfxGg+xXt4g3jAnLJct1wQ+WSxVrkDBccMTA2Lxf69g+x7biPI8eNQn8RwPe3hR+is+EKd+2VV55nWZqhDxcougiLlLtFi9HplRs4q3wxR58yMJiv4ryKQ8+3nlLvFcGSylr0HC50dZCnic9cfG+NYkCWMT933ERG8HcC/cRxAxnFJyI/gGlBeD888C30Wx3BWmViKaeI8Ua09BFbwEjjjvusAYeIixy/4DjxG5N+7PTMNPopZSjEB48EsnyHGWMjI0uEGSPE8rw4k1GjWPEK2BnfQ3BcIkg1DObAx+ysgLnkXQYTw+HhngRCC/rEWZtgVgR4xoO+QaeB8X1k9SoWXvc3Mx/5ivID9dWzHoY5uqOZL4pHliK0JMgWZUvwoIojlfVIhQQN3M3MFZHOuWGdX6U3Z9TrT9MJs4UHaoMZhIM2yxIu2oykPvOlo07mL8JqnHOTcL77xibyacjIfxS5Cf/J6Yc8xNHctSJ79YhfMJ7QfeH5GoHh6+oF1wxy+6AG05R/BSXtuX2Fz+VhYAKfMGzIYyemhZi05r5bC/lu13k2OE9OHDf1XwXFVRUNnhS1jhtuzXGnIiVOdMpR3Q3Ua4KhL17WncoJRj1wIzSt1J1yNcCO3In0IzX30yPvaOJe4WNWR/goxNFcqmbHoXNkVe4qFlJiDvOIqpk6QL5m88hrC/9v13695t7qNtTM4XF8DQrtRvt4ytH1xug4gqwf/UigceveOO6ZH9tXxvs0E/E8jXMUKVe7ZQqJWj33uvwW2fC382IkSislxLYeWc4RVOEc5fZH5+ji3yoXR2dHEP+bxXtrfA8ESvX+pSojUeVYVikYGrpD5ViLR9ku/u3CWeuHlMU0yVm+PFBUZYy4/+Lf/u3iiB1heVfJ4SM92uQAZOt1P9Seub4t+t8WUm+HkJg7IppPlg13sn/umMMsFkS43wqVumMGszx7OkVDAyOczvA9GCPmGQunRvD1HFdcFUsE3y6mvDgq6ZAA6MMnwfiOdlR1+C3fuYUINpsXt0/SyS25o+N71VYF/sevqnBQoEwbz4mW3H/iq9RF+n4Os9jTANcqR9qlO+kYMGfRhFieAoUMHi9iVOl9tg4gacrIdZpw42b9H+uIUU+A9GFV9I03y7nUzYIb8j0O2S0ebzmAv/GeLOOu+onE3wOIkhAexEf+ZoYezqIQj5zoQrXAJbnDcZym4Ud0k3iU8PethHNJW4AYs+IGlr53dxZwrV0MrD5OG2JCFw0EyMlR7jLQOXhfPY7IlZxqbZ9VEXP0YTyBTgYUfdlSyEVPJVqaB+jFSJlfdOknighGglLokFtEfiI/MhJk3g8PGdVyxPO51DXojyL3+Stk/QSf00T00E1flqbA805+5HvQj4nITF5AtW9rHHnSb/dWpZwruZttJdbVE6hQafow76dHRw50X6BdZsp+UwxlALZEp1mySTiUNvusOIqPrBUMEdei9wZki/uCPfCRC/oQOAkFaQyDCRXvpFQhMRq9YrojGt8OEcPQIn2uhIdUA2TYWhNOMCmAOBS1KcfCJkLH/HHffoGuxEXSsBhtcU7fKY59r79NJSUBLO2rOAGCJw/LFfUT+bBdLlFAz8NGX+aS0AAp2GhfIDU9kttxdIu+snHdeHcXw4ARWOpGmhiKQyJDzFmoXphZ5PGUKfo2u9o6+RJEPYgb3ELAbv/yBB99WONY/DwLCRJxMZWlcwCwJabIZz1Uy6rK5yd6OlWCSMWCHKkcqJB4BBTygVjZ4IOEMEzDhSSPyX5rjqV26E4j7u7OhkYImKJq4AipsyYlMamcFnP/vrka6QTKkCQA7CC/u8sVY9GYhzVvlUyP8OVnSMWwknECa1UHF94HuaxyHg5j7lE2QDQBni3GP6D8NAivAKIRwOcNZCN0LIAoN0jpfUaOzcaIt0nFeJX7DkTZkuSOnb5w7WsBNOvoGp9xI64apqMBH+XwZQfQS72AXqGxp/zN1cSffoby6pU1/cqDyOdvrCYSn0gFSz6zUX7iJsgBT7S8VuNHqT4cp5jjFEuZFpdG9iPtNz82ZsydZC18M4tblMU7rnxArzdVvwQfS3BhrnRcbCpxZSnP+RnqhpheGK2R8kBPnqUWifScXAxrjSCRszXC2Il/7JfyuPFWA2Js4acaICjll7UNLTaKXVN5vAlZNzvWzX5WFkXlNmPi/wUNlorFvRqMU/JnmVZqGaQ0EfvEJa1s97aHYwwwk7Xekgp6v3GCD9mTNDwg8ca4rINA7GwOmU90gYEvdcE/P2hwDb6Pjpxt4hLblOn3OaQpUwm/vDfi9buaus+ldvP3hJBPvsPtTflyv57l9jdia0ROthSnfPKbkf196HHdJzamQFRzsfNR2+Wx+sun+M+zgVCaSjnE3gf2v35IJx9qrQ7fst7R4Uhw2eozqbn9PYrT62xBXpQXJWYfKNXwvv0gNSHjUTOY/gwlRK3/kYr8zTUYTAMSUT2QC6gDbCg5rrmK29AqzSSYRcXILq3otpQ07m4ZXTAp0OlNomi5uwYzh9bLtTJLTZbbckO+bhvB0jJLbyr4fB9tXdrW++RjAqAqj8/eVbAraMav4BIYP46sauVVcDtmldt0AcXYpFKklZCOQCtv0rx4enZWkXXGLKsKDVfWR1is1/2J3r1Ik36aqN2LNBG7Fz9muHvxseFe7d+9WC79CJ246xc6Av68BrZnuQRCG8o8UP9K1xoG/TBQtYZyz35K++1nDXce7Kx1HkgIuE+J7w763K+MbYkwNNjINLtV6TMyS6ZavqK2PW64s/1t+7j0g8R23DPeRvfx0v8xg9+VqKf3debObntPl2t/mpg0mATmc1hICTrwkXsexmMvcVLhD7EdiPMvWDQUKfYTPu36+kYZdFXDYDoFqPjiLGmlkHF5S0qe5eBBdpwsmFiG0wsOuS8n/z7PT8LIEq8jiVO5Ab1tiFoiw0U+nqXRzpg1oMhk43WWxBHx8ikRaGiAj9fh22bmWV9yoDaUEx8y0RY+ldRarD7c+ilTL7JoScmqKdk07px2ZKLYyvZgnYdbCvrpc9yAyB/KZ/T6OS5KhXbPaHcW6qFvsbu+Svy8T1eb1tkwx6fXQObCKh5BH/me0yvgrzo0o92sxc7dLHpdTUqTnJ5uxLH3dTby8Vgav58u4btmvHcNTEDvXdOWDMleS8CgAD64UX4eCJ80UBNKCMKGlR4toqLBHJSmiS3SbXxkzox2+OvqhFAxIgm8DiaTdymXQXKOnIM8CfP8e8CDNDmQhTkeqQj5x7nl8PDkPDnPV811UFRO+ItnIp9TWqnL0wae5otfY/rSUNyLB4cPVqgDzRdFFS1u1z0M0/YL9aAZ5r24fnB4ofiLrQO+PNMnxnSiQ8Ogivdos4Iv4Hi7+Ip6LZ9ToX7c6CKTWH0DqNjI+2RVXKss1xWiEHkLbIIlJzDhFLxDSmrgVjxXeUDP3FGCdLA173GmHusscAhiNqcseaBFNPRx6atGJRUWK1sDAt+254Cd/n0oinsLHJpo+98AZ1KN4DHOnWjZwl97NA+46BgKH1GKXWKLXrKWyw+YG5/c2kW5Kl5MsJiEvOK81EvkQSXyGoSI5VRqXEqNRap+3RJl/kec/daXrHiDohr+4Fk81KHer4IkrhIYbyRyuf46AtHMt2hpA2Vg82c1afOjWqQE0XZ6NGzdnMPB/R3J/MimoDLd3dn0Gbu2BD7Hh/fwm29DiQA9zya+xTa6COn9JxFBjkod3EWcBdnHZzFMTvhEz0FtvV5jDE2N4mSVy73a2sgpOw2TzEx805FLGb5XyfQuk8NEpvU6gept43CT5zBfn5LnuJKRJmwpuH8Hn/EdSny6dS1NxJ7cbmwwCj4hnuJPYhFQRyTLct8keYwnryJVvfYIanaaTeRjitucB/JVnJP8lNk7k90tNBz3XnlhMDiOfo2TI9JPxKO09u4GJMaDouvNxu0ljBwQ8Y4kOtxP/L/SvNxPjpgSV4Gf9IOHeT+AeXwniGGwZ84WfS7HbSEG7Ho9z9j1P89HsCJbS2mjaKUq30czwmk32dYbBIUeHeyCx8hEhg6GvW14mMrnTFV2MzdP72/wa/4/gV/zT/Nrrrb5NxOOOAR5UCR0HoHSQHfMru4odUJPDOq9OMhBj4tF7KLYgK27RkLW3aGUXYgiY1PDyCbeU5PM6hhYxZ/C6shzJM/afKp6yNsFSwluqOMLUx1c7HNUHypLHb759xm+gUWROfEWa3nooKYkep5+iaasuBdIahCfL9FBt71LcxI6phhgPOPTK1hw81HoGqnCto6rVUKdpBfA+TOWUk8QY9wQYcA5B16/9GwgcxJhxgE9gE/VD+y9eo6LB3KwqOntV10gSx/mYWGqwxu7NpVHPqmvtmY/RQX5pXc45ZEJzIt6jlR6b5F+e/b6e3N/BVYhMPHwJVkfGn53h73xKpj35VpJCVp6aRfJe/9FKdGRnuk11pkytG+VmvJTkWDHE5mp48Qoz1NaZU7VG2tTc4U5rfJmDuSHTbvLhdOb6plXFEzNgqnIL+sol9ZPNBuLYf0iMGpsKZddTn+q1rhTH9/lznWiC+yJa06XKqGhkeK4dSn1m0lvKgZKyqXMmksmjtJa737RwTiUyOnNQGEd66iXPAOJvUP75UovLA8m1QWgDW7E0N4EL8R1bEzeobFKCzxdUhvXMP/x0lkxvc1DdjRG2BGrdMtSPGqLsfdoBXN0TPuCNwF/a1w/O73COZVG1tp4vprew01wjR7DH3MrE8rjaEONuyK06DIp1uv+TG8/LZL+Qm96LeSm1w+0MfS04V7u3xj6sPS/wo2gKNmw8Pyw3LRtKRt10h6qOmwHfC41PlHSjzQ+kcTnF8LnQ8O93Y/Pc4FPuInP8y18zA0WWgHsNgLVicK4mjqVP2NIKT3Z+zwjbqvtaiptFlOPXOPDfOMp2+bOOR8DOQls6/jYcoS4xLRhDRU76wES69bYO0z6oSZWKIn1vEBiPW+4H/YTaxz6PyCxbkL/F/x9LYindvWuQ9zVW4Z8V8+9CtyPoXsGkYHe4Xsclh4+xvHI/Ee2MgeRXz5klCZEjlzLM6HuuMx4fbfylECC6MmG1yHtFmVVwcYCgBwEDKepzcSnaOJNG1Mv2AYXvF6uxLYPnw71tgZNd6ZBA3ftFP+JExe3ZAzywilPkLGjZYGsvjpf5Fd2UprZzPXhjg0PaClxTNWMdfW2l1NC04gvSiXWLOAm7VqTL9Gl9CyxlG/fFIyeVwXEYjcRpjGYRvoSmcY83NFIeSIi1S2dG08v7O0SuBEbOy4uuA48p+9slNLrk4q5mWOCXePFn9vNrSWOjkxal1q0Uv2Gr+tKmS/Dfk3QWFQi00WQW0+YBY58c2WuoktrIIkwG/k1l/1ntjxwt2JAkdituOWgjc+VJCpKAgPPsCxngLyNL/AiBPpWt3m0uYTeIrVRY/EfJXaud1MgBm9N8W0Xoq3c8sC3tlEf58BteqAcn9iO7cQoTpHOPXZtjH3egbSeQmShglhnE/noLFkigtSHMmS5VdoE+ss7Qfs3fPTJ1+49Hr4QZpsXcZixcmE9m8mBILQBETL1CDWs1HoPxKGpXm9aW8mapT3dlrDaHHvGvbn+BgxD40Xm2CXS8OwVFrkxLHVqwBtcV97WlCX3O3lZKAQw9B+qGxo61s+P5Avi5Z2ELXFZWkh8ghh4qlEbwDBiKOQtekD6nhQCfekeNEqRRvmnaAQUSjmFAqPUJoWCMoVSpJAfbJIoHfnBUX4/EukGyrNVgx3la8wMZ+GPOD+KOWFzgcBKRisOPXEus5TXJsCiK1JuuTW7s7V03Dr+Ly1cE9eKLxOyfVzr7cENWzmlPpXWerxeQfV/unZsMhsZO5aoepXIKY/hTTptHVzT6Xklitl0UonzyizGF5CRC+gUmy6CxGRB+iktU9S0oV/SG/BY1Q3248jAX8orNLyR37kjcs8CzG00DOWeTLzaTMStbZk4DnXi3hN6fTq/o5FqaSImIjsZLsPR3d0LvKxHlgNoz0uG0HxMuZ/rP8iNuuHhISh7GKBjH5DsiTxsVGZYJWuuDUPBQmn5xV5rFDy4LYEoZd1lYaTMXUwpgbdq10IuCeUTuVhLnL+iitJM6Cox5+wAs18/XST5VRwVQDYj86Z8KomhZORvhI9iIZQ+reWSKqznR2YSxt2nOsszQd7fj6dT474nUwpwWbVl5d2v/taqX+YEeebuxtVkL+qc8tyyY85gox17brtnBeZ6Yu1fPncs07xMZZiSikc+25wTYuiMY+8zk4HgSpJC+YYeJOyd+cEhx7lsLUm7XHOYrw/Elza/S7g4BP2oGoECBlmEVZLOwlMcGotcfskscqigmbAjq95CHTXM3Uq+SFmTqdZGDlr62NhMaZXWxzvBtBaBSHHdN8clAQqwomqc8Of6rJJWJ6hWYx1kssE/cbaDFQiv+3GBJpF5WXsfMPPG9Vt2+Xw5Hyji2qAXJI5pn0nm1HS9x0LlkiwFYi6TlUUhFVqLLdV7gOHl0ZhjCwSousy9H5zNsrzRyoB4g/AcnCA8zpJbFykcvdWFPcHBcW77T1NQWOAp+hF3/lX6CSC89N+mHkHZTbt/iF02mUVO8X+5wYpdJIS/3eg9DIO7XDRHiWPF/bsRO0T0sDYiALjC+1vl925X4JHkuk9Kx2Wcw7rqDd5/9zNo1cfQz0pJ2GeUMgs2Uvjwp7SrzbS3oLdSyhnB+6C36V4wzCe36XhI6D5UINschgNx4pDTFgI/dICVYeZeBfoUwull5b7YW2q2pxS/WLev1E24u5S6Xrev4HhPQaHY7yt2ZhZzM9QS/YOam8nNRPFRhUn0OW12AeUMJZI52oHBnIwnXzfc15/YLQ7958Bj7stsc7c4vM/uteipdWlLcS9fyv0lqYc4Lt/0M0tvaIh/GVapOPD6a82AL7P+y0wxIISehxssbb/MpE3ohIj3ruG+2U+8d0tOvHeh+zZ02SYJ3+05AFgh7Xp6NUeeXNbS1cPOxq2L9C3LAW1hOGWco74D9R9fPwxdYU9m2NgiAVimGvld8OctB0MD7h2NUCNd7dFR8ltKfqPpxzLMLOnHMkGpZyFS6m3D/UZRCqPfLn0kWJBM0tlxvf3OO+02mrU3P3da8+W3j5++/PH5219effP9syfvz77+6fV3Lz589cOv4+jy6veP0z+ub27/JDK7b5Y+2oP6dQ89EEGtUruJfcvCvR9xtfT4uI/3PLMh3WnPqFbb+VIafd7V1OlQvHa/QaAcpDhqRX8Ofib2fhEWO/LfLjeAtZsGGLbuf6NJs0qCBDTg3jdLN1zkRTp7PJ1fBWNW9N4s5XD8I9z2J3JJd8KfNdwHinYPDKiy6IyY8Y+G+2QvM0oMni3X/rOQH2E8HufpdFGw3m3gSm8+42Dt2+jKxX2fQSZ++f1VMMfHLoEds94fS1dFfsUSvpPcewBg/yCw6Nri/dvv3qVvgDi970J3Dr/v0hc8uneVAPwpWkhPQ8d9FXKr6e+W/iXG3QTcHcp1oOyw0ZxTeK3mR8Puq6X/JE3JcuyP5eHhg6Xjfh+qqHFweHgbOO7P2S6TW20MiMIWj2TVtnF56VuKVgfCB6BaiLPMrR2NC2lPn7GQxddsUnmwYmtSYlgwwWWZNra/oFuJ3LAxxxuS2v2AK2PFadb54sXzFy8sccxVin/x4rl0r3IV5E9ev8KZQAGVH+pevdB6ZFbP5bayeA3z+/Du7uS385uj3vnJ+Ykwy+XJsE65DeS39l7i85iejhirXNgfh4evlnKJjjT6bqmai0fnXEfCLRThVSWY+3FfXpYJBbPZ5HmL9Q9ULYeHScmPjSz8Vng0wj2EtUpWBxYT33pIh+MVdLliHT1b2m3nCB1GyDXWXLlYCeYGaGqPtiTFEyBlmZq7gZtSP+pNEs0sPE8Iy8gIWqZ3x0Jhjq63wHnOia6Qs7stc4Lk97kNkBv7ZB4k7LH9UMaGwtLGqCe6dz2RqieQ9eRmPYEfydhIWk/LfbCDWLVzAyqhXUZwLUwjMGdK7oNxwQNU1GZy00FK7PIqBHJPlc8f6RBrMCWAyjJtWjKWmgoruJ3lRAldUnlHkYVFISwvzlynxAm4XUW+fZyegVyggRcKaiwMndZmcqySc54crF09FiSv6lpcYRjia6gKVwAh0OwFoi6XI9uTINeuMVrsKxwvAmB1kU39q0QPH8eQO6pak/sxj5uujW6VhopuLCXY8DoYOXwfDj9NXxdaBOmraVwc8B1yvXHPDTe1bVHq19yprxwFpA+n3FUDbfi7wZGPW/8i9cjry8r9eF348TDWy5m+dD6AIv+RXzgoX5SfAwNXFVt3A6E0PMz7Dpn3JEd2fpw8euQ5LnuIhjdO7geieIUDhtgjbwTQ4YeDhU9xS2St7Up77DjG3UFhEZcceWgIrcSX0mi3hDFzBjg5axllyEjOALiyErMEpmcUtKrkkECMNiHBjPNvyKmu3PWNTivXANwsR2wwlS+0vAAabZjKopaKoIOyGykBOu0b936FTELm/AxsaTcPy2YCM+3DfKRqGBBHq2BvSuwFmoaKcz9HMjkiMAv8h5qKqCpUQzCQgkaPxBTtw3QsjUmKI5HHBzr/hmHXmxpDjSxnp3wdBwD4yS06BENu+y50Qj4EvwttaZ+2dahA+SsSAh6gJCmMoOsgnqLhjNw5VXf8aPUnPJFEvrShfcqdmiK1FQWlJMbD2FD6hoscN5S2gtL8cLUu7cgPLa5YoGOLHP3xIYrok3pijeRtmAPlOQyPl0Xk5kbtnA52UCFAEyIZuXZZqQ9JGZQ5y7FC7uIxEN9nyVA9Ly0VuXIgdANYBD3RSvXPWf9nvYqB0A0olDeBWgR9gzJyO8b+WS0NC7LCetBw3+9fGr4Q6+rfQ/fP0H2/6f3vxb1W17RV4H5qWVg68tTWcnwpbCRydVRde9PnJsbmsnRONijKhz0qx9AbmSk9aaZiRurTVHVKc+CDVNY2e3TCnu8/T9IX60rnEXtOvAVvHUCPxfw++I4WSdVvVyvM9sWlFLmjUD4W+cRK/He+Ev9z30r8fbFvJf47LbWN9PJK/E+erHn4fYGZJQ9D6EVY2oCz3xeSWZe0wvyu4f64n1l/zVAOzmamU9RfpYvXzB3CKB+5BzVHPMiinRUP0VUYuhaz/j9LrYz/f/be/btpZFkY/fmevyLR4QvSuPMwzMze20Z4mxAgQBLACQw4noxiy1jYkYykvHB8/vZbVf2WZCczMPfcvdbHWsRSq99dXV1VXQ+jZEhFxLNewS6qSAHLnSGTAlQBS/Bhgkl9UwV7SLptXr+FqY0hcUXHDr5tNZIWvk/ofFmte/T1vnP/5oay3Qe+KUFuaQKojZd0nRaQFaIaD17Qh4kbrKNxSMBBx7jDGXrkgBAGzbKWi7ciDheQk2rbBkzeGZJUahgeHPX+UCrWo1I1FfEqykQACu/1Wn5Km580PvokpSqfieXfe8g+LF63FwLJ7F/5V+RktCiBenE3NIMivKVoBrGsuk7XqHb/aoODjfDIKYTx6FTTyF4wExLpLesNkDzeTm2y4+ynTZhLVMCGnd7KgRluAPgpx0nuUhddSpofcs9/6Ceq+cHwzJc2X+q5hrcXfUvc7b5USP4tSWv2H7Lni+f/yZU/RenGsyuuRfrlimuRfrvyzzD9SEg93l/5Oaa/gHfLNjyMlLGzrVqibzRSqTEAeWNOtsy4GjgQZajaNvdTgdxD0ziYbr9zabiDJ23MTk6IoDg5aXy70lLmeVOeypk6lenJyH9k5ke7FoLpDKa34PuEw0xqKLKJrqN+K8C+ZZ4pFeC5Dt3cl1+b8sHPUF1S0BSRZS7kh+iYe27fxeB56RkY+T05X1p8SUVYu5zHutPBPC/KeYp3e5jtWTlb4UYRcz0RHqFuUyNBN5P82sCbPzeksFEzjLQUNhLwOiY8/+Qh+6jg9aOhTy4gjoOb0r8k6V5IbpJnRb18cmallfJRpXAu5ZHhFBt79pC9XLw5OgGi4Y3+KEjRt2Y7dwGXvuojki4kXseE1wupv/V9Z7OYeBqjXV8hMY/QPWMh8RIrHRZTLyD1/ykmXmHWtJj64cp3usXE55DYKya+vcLTpZD48QpPmeLwIXFWGigkzouJn67Qs1sh8SUk/lRMDOvoLLg4JXX0k1lIHMf+Zvc4P46Ph8fpivPf911vs9k9Pj7uzebonKdjfV+lDI3mv2WOm+NNt+Uf/+RB1rTub250j9Pj2LnvbsL3Tfapj6UHwfqwtxk1X1bAnhTOCj8vJDggvQi0zUBZ/gbXSKMNkTESv7EJ67MhG7ApG7FTdqHYeHYNdMMlkhJjQnsSpXb08XSt9el33HdS8SEU1t2w4froAG0A2+wduzaU7w91FWPL1dD1Y/9CZ3uCdcJml3k8VYYc4iMewAKm0vkz/13rnRilbL4BBE92GZFyBopG9ZJdA+3hzfoBbKzTuEG/ecR/L8T7lfi9jBuziX/dHCQrE/SoWagJ2MxLoF9D8syRRzc3+Hsa898L8Xslfi9RLQpIO6L1HETZwqvwxOvBrE/W60LsQS1/uOI9eC5+X4nf38RvWOe/n8T7x6sGAcBHodRHIsVt0VU3o6Y/so/sume28hZKwXye+pfSqeYln2Wg5tFD7agwc7U64ArEv8CaA902AmKsE/DfV33+m0f89zTmvxfi91L8XsWemFJsecAp1EjpJzsY4AmbQfZ+vY6cPczfM16G95xYoR2gWNKgPw5z4Sxz6k+aVmenUBrquI6b3hSoUQZNDeZ8uQZ8JUQFmbUY2Db80JLwpordo1kI/EIZ3t+bm7TOBU+B18I2XCCo4P91r+HaTQaqFc9ckU4g1rvfmPV9hJtO0AKE3wD8zpbMW3/hrNXqhXmTKrt/ddpE+UWTZo4mrzdm45gMGrjlLfQG8KXQM0HUaXxDBeuJIWVsTHzz+/oDhq0H+TraG9+p+WvYvkS4+dfIC23ZI8ViYqS0uSEHXUsUNznWnqytoYX0b33+i0CeCSDPBJBnBNz8F4HdpUo/9aVSDVZJOAP+Ua+a5W9kRUy9qewqNkvVAlaFqbjLPMiQDTMEJex+aUND+surlmtBOfpjva498FDeKtzBITwZy9PYcTWt5tHKyNdFPfIabqcICx0NC51bYKFThoXFE3DJKemhZ24wKQK5rtXYUB84+3jgjHmBd1JjjyLnNPZRQnkwRNFm45ChW4zDZBzGjSdMWoE3Oop6y4h6+/KQxdOF1FtU56xNXOesTVbnrE1Q56xMPiVWhiV1PwQ0zFLgG8hZcQOYbh62dXXL8A4+qaPUQCmx+qkho3/sbzXD9XXJJqbdsIfMX/dh7+Ym7z7grliVc8o5D7wzXeI+XDAIwpEbKiQhnR3Uxa3Meap1k/Gr8DqAnc58GdlBObKTrppE7AKa1+gbSc1VDZJd4RxNIxQGvVK4LC4DYOfyyJxoOSMdm5uOwaJ6M+cKjCFKqeS9LsulVqMjLQLOY0wZtHklufQiBCOPcnyFWRNxGnhAERyEELIAxdSXjKK4eM3lmDYUFAFMiFv0Qg4FW2guB/3cwrUi8YrwRdZ1Wn0OoyK9BWdRA6hm4VRsBmPoKzeyMi9QwPx7v9vXlzuYk4551jcIMU9KMZvoGstwF6FM+uQ1g0sTwcw84i4UdlZxmbfM40c2MYMmkgXfoMszEvTLwXAAz/yJGgFQtRO0TEbnheJen5NVTQ+/rK/zb+7yUcS0FeLFY/HmMh4EinaMrk6kQnmz8ColtJVL780CPeR5bjmU8o3N0sa7Eq4U+wyouB1ofgJHu/Z7XnCmv6RsBzcMljZcxEpbNCA8KXJNCDM2Mb1d3rL0OGm3AwDf9nnBPaw9ZjRqaJSHg7hCBCDALHj4unlBy15hG2/eH4X98R7ZwZT9cPoyFgalNYUHuNW6yT5EwPLEhlu7HLBn9piferAVsx5bdRHMVhWY8eAFddqiD+A8b2aAZ4XsQaNKyRHxvq1o9+5MAi0dYC2Ew1q9QYA4L3R/i8cukr3rAu/WE85M4FgJM4Qq8nGdoDsfRBsZRw84Z0gp8HeP3lEoy3J+oFMyvzpbFdYcg+RcxJeLXRl8ATel2VkgIACHCovSz9HAcDkh3X3PIz+eK3+kJX/yiJHjerOEV78X7prSz6lC8Q/Y+gNa8s3fj7Of7m1KUsPLSYWGwxnBHvq19yP5Ri7sUWSjrrnx8luIUn93oS7P7f7e++m449HLvU1Ye14lrqFVadyt9+x6cbXn89KpN7Pxhp/UXQ1JZdf4OIuZOYsRw0NDHVAIuKFxnY/wI6GuqeIimWgapY94Jmhp4m1Y8+YGyI+wUECvB/WH7xoCnaYX6tOmrk5cEs99gAxoDGN55kVv/dyiCPlRGkJkeTyqghI+B0zo3OMiSmUIqXEj+oWA0eeb4Oamr48Q8aKIW0LXTV6f3aN5VERnhv2q0S7xFKogk5poDTznrBpQPaPeMw+azN57m8eXAooxo1cxh4CtjFk0axVGDKLCE6QrzISfHHJCZM+/yiHnMxLOJKRqnFBAAayc2KOmCyQx04A+ExN30otmHppeIM5POUXi2mGahgtwu0LWfV8DebOPFG8fKV4+490+YENEB3nyOrmUEXNwsGbEB1gD9YbHM7/qN0Jk4DkKW6+P3K9xtsmjOfRqQzbEIZmBJPRc6sqHXoHcqe6c2TfeGW0LC+w4QJkcPRDrzenjreZUUvkjf9idSuAeiKsxy5J/FZd5pFdDgPfAHyrBT20wX1zUtWeLlQY5YKj2MKfR2UemfLd31jzk5ld9/3G/UKBfLGACqADtgC5DqDBsCH49hTRDQLrriuqJZEgQhhopcT/IyfQOt0rBygy3JRqoib21AADn5lkZKuOv0tH/lLKtiGN/JhgVPMXm1luNji1h+ejNieV7V2Jk8mn1sSmv5/SBplFSgVyac2J2ZqbKe6Zymt7M1jfbJblvHyXeQkbPLE3Unu8u+MCjOxmbrZKXlOW4rWTLruwO7Et19gIha7G1dotCMfgceDeM/xsOZOQPnGRO8s8qiimszQXVT8g9eqE7f8eKfP/8Gzx59cQWeB8pJHHRB08ahhZ5rhzLUgM1ItwqJsGm480v3YWzgwQPTnPRLm01r/Iy71ak+othz5vPLViyOqhdKSu9z6J3TGRGTL9+UnoRotuPSLhuscFGGC+HBXmIblG6BCythzdnYVktp3pPhcohgkS4FWRi3Zsn+Yj7fObjXkU2iDQLaKtn/JnTBIIaL7iektIS7nu02W8KBSrE90zw0n2vJP/wUIMi8/sYfKdSEKKUpBJSd5eChmIxFDBoH3QLBCDIU4llINJ7gr43+Ery45ufmyWhBt8niLkndn5TulHYJihqRL1GTn3nRbEIpxWJGcXQniox6AamSAeGwmU6gR3Hgy8Ixs1eInOaLxVckEtO1NkJzDhFFhLj9xroJxQ9K3BN2YTU05oTjbP6tqiB04Z968wv0obL5qppr492t26RxBNvTuGIpQbmHUR04uJwqZQOiVt+jSg63yihM76MTcrTFN+LeNDMMxd5TIET/yJnRGirK57azCNvRoQTeikINbPMZAMGfSG+y4sCbmUgtriAQ9kpPj3zRXQ5hryWYdBQW1oZe+jbZamMtoWXzwYdCzTso6Q5RYFF5kdAw6LqNIJH4BvAgTbUCXqpXY257lpgmYy6AywKcNXiP6TkREN10JikO63xTzX702o67Q5gA+HvsNeayKizdDXiMIc3NeFsVKNPWmnijbS2+56IYIshlgbnUNQdsVPPfzyqneKZ5lAcOhF2xZ9hfJWpcPA3mc9JpXeiIqYIJry5hOgTHO6fkh+GtgRQ+Z9SEm5NIC6pQ5owSB7E5PZyW+DAt3Zubu28uLVRWUExHZE2JFwiyby9D1t3a7ogWyi0/ZeHnGtwXTZAk6/UEVgdI+pjTlEfjXiP2ONu3DM6G0ofIAAUshfI0cwLlKUZmLdA7nJ364uYF6XJQRF8kEAgekUF9JgXsf8SRkjXJW7tlzFDGIivTFUvqVtmXZnfoV5T4LSkTq42xq8YdS20+ebFhBr9mhycfZMkaLrqptr5OmZagTNnlJzD4qPbONVCbrWHb7XcamnejKdKKSiaisvIbdJz/faQBYsvI8/rXM91WOd6lf26n01NPcp2XIyxM6xTCuMCyH6dzNXS6xkF6sIjVvhDieVwYxUhlriHeaD72o6bbe1fFN7O67b/BLcdS7XRNqnhHT1kyeLhnMTLLVcN1Vx0ZEs6DDwNJbcYDA55CGQb8NfUqETteJ5oRLlQQchRE0S74Ddib6sPwtpFHqOveSHpobwQdFx8EQaDtlMfbhCCjnrgjxl7u+jTpqWeBJSpgbIZ3fI3tLo/4/Zzwr82PTMEe+HsA57mnozJbWZqGc9G9G5spKGeADwTveQncfNEL/mJdCl7QMD6/iGbLF7dad1vo9LvzoJVRisN6c5A6PhLEybedX13RFfX4no6meKu0da/psMl1Nrl74umGs0GpVNlHpVIzIcwkkGFhTeUIOhlnSDD/sjPrizqL80orp9p+03rhFhsOyAxWMEh4XEggD0r9F3lHEYTHonmsXaTJzcI11Hvc3unisHPmxO9ujtxc0ev7o5c3W3auy8esuESVDQlu6hphXajNzufdsMeMHH0S7bawiQYICCZFJ2qiVRyVm2/kfNLCXLUqecP2WhxpwYCP47q/gDx41ndHyMIfq7724Qvp/4B/l4L5Y3TeiF2WZ6jl+PLuvBy/OGhv01W+nV/xsnzhsMdZKhI8Q1HRg9nyNY0HHRnFKTc3R2Tri0gWTm5QGBuOO/IpIlXSRXO2RW0wmtH3RH+tHMV5fgmY93rR/nFaK/wqnLIThjP8ttBTAoq9CvTLPClhDREQRg+Yrflr8wve2z0d87GMBhZ+ZIK5yxN0RpWHmBpZJjeCKhJTccEMm0DGB7Le61WD5pOtWEOijL9i3qX648rSqzo9Ab1cOiexJLtN9KyYy0Xs+KBb2cF7hJd0nAHLq0u4Kqas+7UQhgePuK0OPIB03uN0MxVncWsz6in1+Al+Yse90CPu2KcEv5aaK1kQGPKHBMonF7RRQ8VEOAKmeXKQ8bQp6lms/ACSpOeV2OL0UvWCFkkvC9DGjmtT9lFlEWQIHOK16zR7c31ME5M66u0m+fC7fdivz8nAV1qpqQQtRNgZIdpfsuho2NBDpS8WxxElNJUQcHLHg84eyKsMXJ7ttAfXkUU79iHThqRFHLT59cUzZnNhP5UFKCTDzlH4bdBhrfDg67gmZInoh8/egJKgQczcc1XZIXFdwz141PFnmkd/hkVGbPrOA+uSBQlXzi5SNe0+JCKj/zFYxl/olTx7Am3e5npdi+wz3ycanF2E9XjB/MYhQXdSxSQDeqGT9C5CBZCtoJEy05hQWP0JM69fYSTaZhyC5+dQOKcxg55fFFyEv4sPAfw4zvzbSpEJtM9VaZcZWfm+tNVJ6KwFhkJkdmOTHKNhrx5I/PmAUxhv3AW03Bbb4CjjDL0WoUVu/qLDJ4ip8nIyQ3ozUYarpkZwNqIaSFShJLfedzmffFYIYNcoIKrKdH1DflxPkTr9cn1onyIlV304Y9kCLXFrXoUd2HY+cBOEO27sFKibP/Uw8itQMSOib9aoZpXxJoAeTMK4sEk3JGOSixjWD4fBilGIEgXC1YYRxPikD2WWoXbWdYhaKeM3A2OIJ1d+YRAb55nKOQP8z1Om6GDcvX9PYAjIDTNYAnSRtM41IPCqxEvIJwLkHovEKXyY48sV0zQPhd+6F0uwkM7JSsHsB3K272Rpi9bzVROg8LpghZlzXKoAbEKXiVW9AqcD0mUr+pQ7dra5u/d9vqnnqHQU/QpJNl3Oj1W7s0idCi0gsEsrdmeb6wcptcIIefTQZDr2L7uvQIzsXEhpn8F6vU2uCOi1TH2x+w/zkV5CNwLLmaNuapFi1xWUrhWNLdr0Csd3rFNCKgswp+B1YwiVtbWdH0Cs42C7LVYCl/4xKPANvYieUqez7HKit7SM2OJDAcjISoVPzKXTwqpQoz/alyFic9C61jgi4OY7Ki5JyOgznDtYE8Fl0EEK10UHoiR6B0ac8tIqR1iAzMrDtySfInNjCeguAAIkRhoerOQEwVbQubaBcIHvVJzp2VqgpoWaiBa4zDqj28fitAp7OZaUkg0R3PRGBnaf6phqrXakES1BCvYWFFP7qWKbLNqJObnXGJjekU3PKAL5THD0jTDIAyZdSx6XpOPU54jGKMqFhcwYgZkxG9Z5E6LOy84Jiyc6qbhv4amcOFQQznUKqdkIU2VFg0ZELJoYvISLNmhJXiVblScLEl+Ri5aXnstc9pQjUChaF6+2EhhIis86ytU4Fnhn8qVSEKCL0a+cDEwfLkx22qSODlhFKIEpfds0MGWH1XebLNMK8uFJZzTLO9XlM8Az3Vax4jGko7MffliRMBioVFzKnPpFNKUMeJnwVoW42fFRAme1V1rskqzR53yNqSdr2tLYEQeFCaRPq6ZiDR1rPQcBPUo8O0dZ1htiqr5LWVSE2yQZkbVBaqqWeENXZzRFvgbO08gv9xbUu0PR9kSY2snwh2cQ0P/vgIdLkB4tnd8Gf5I4XiqeEGVKpbdHbOHdugmsfyCxs2XUsC5t0wEqZumeuT5ABRcj7v8X4AeI6GvikgSoNXNKzF2sBBJBCxXQWfmykX3qhFmoxxjgzt/NwPBrm4JIMqWAtFcn7nqSsK6f2M8mF2kBQEYm1r7DTD6FVX2K1LBK+UtrFDgQGUQU/Nhw5Q8PFKRZmZSQR/2uJ2n17Tf0XbATkGvmsbNovzGhdZ2ThldqryeAa2kgI7ENQIdVS7sZOHCTpDF5isqxS6rqCAz4+q+OlWq/eIVv3D2Y4Th6ZHus5mCA19NcPt6s0TuYuH2AuiuRJ2Vc92GvyWDupk1zQVdtcEFRJJc07KjR5mt+I0KBeZ3urw3E7BvqFCQYog4KR+KSmHJFO7RHYzseGclxZ8CZxRgUG69wqWvsvhcgOHcwHBFanU6NdWhI+6dROgawUBUsLyQBzLAKAwx1iAuKFTNdNNm2DuUmDmcLXmLofEN8qs6mpYnO77gykHgNP11ye2CQXxsiBw8d5YtywnYEHMhPbY4F/pFo1ziCqS6m/IrZcUjv5DNIAZkPMxCKDYrn/pMmUVE2opm6ZoUsnS5J1/l/+4w+NxTJRzt6QqjNk4NF1ecvyUHVzvkRX6kb1WmOWaVNzTwdl2v8J3lTuFgGy36Ih0pkbXrx4fsbPEFSkdcmLTFhcl2nV+YnIiLkrfiQuRw2Z0ebPGil98qaetJ6d7vhLz5imfznu9EX+xxso9l/omwpTEkgtvCAkfXzGKjNhsLU1vCGoICDAumm4tUZTBfkyhnwg8dxetTkBDw9Z97IoIvhXSuA/tlNi08AScbUbaHgM5PngnrY7BdgyydSAVOo5MTj/ULyTgdfcFWJBT4MW3HcZIHXHe3NM6EttlfEkMukzv+aJHh3ejqH0+RnchbYQsDdntLkJ2e3AU4rpChjN70UlZjNtH834TG5Byf0AWDNRlEvRNRD2xcu04UCtD3rpoqc0sJEJC3KlykGs3/xBJSeyiFvR2F7icfknSskeiZxpOHcfNQ32QfypvsU8J5rx6y68U4b0dcFh8AriPcVvc/o1buO3FJHFX6V0cBKh+zkDP6zj83ft74+V9Oxd2C6YDSdFUpqWLDXVnEY34RFSYkn2j+utWK/Mg1hMsUb1W9qRBnkSkvsV2pRYo1xPBS0qhGpxbj/1lVFYTeXi7VFapKadlGOdtqZfWuuElCEzfN4pfFxFHNUS5gleiXD0DHlsvn8lpBKnlI35hlIahkbuhGazW3BRL4TkKLFsWX4KcL+W9sYMKBkTA/z0qhquzrJdGsmPYCWHTDnriSwYjOhnZY2oy0nz54e1cvu8Z0o9Rr7iz4IDbCvRA3wm8P2fbijXA55a4uLqbc1cUboU2xW+exC66m3PXFeMo3zNO6/xYjIXwV2mj3xAZ6XedeGPfqPIb0viAmDgP/FDfWE0FUdKZ8g7WFC41ngsj4whWHtFLASwxiYkaWNo1SC/4CUVoH8JT69MRo4fBCef5SisZNN1xSRIy+NmVrMbYWVNzWcP2U1Yi2HvATtqZK7Y/GitgjoqWVyyBbGYSofA2n+2BjZS/6zDUzVj6fR8D4/tcoz6dZY3MzvIgmZ0GaRwFByNlmH+A+juBgzzZFnev/XOe1rp/JWv7w2NlGGF9svG7vP19b08+W/UY/RvO4cl+Pz/9V396Gv//49UGx48fn//xn+8nx+S/Pth4en//jlwf/3MC0Z9t1ePvXM/jy68Otf8D3h7/8Q4/i8vJy4/JhPw/7IxpEnkyj/uaDBw9+/cOT1FHOJ1du1cRGK3AMJIXbM1+soCfxLEs4IymrqCbbYuaIeor0GjcuQQsnBpuNQjTy/aIBg9ytqQIv3W4MnHfPkxnxuzdn8bz5UiMr/1kdXgmT+Pv4iCZF6Ebaf4pvyJj5r/FJ6A0huY9Du0ANCkgOVCgpiucpUlE7RaZdibTUyNeWaSLYFBGfsqwQlMj0sUi3Lzn9XeyUoTXkX00xE1A9QYR3UW/wu3bDexhgdln1mOflI7rAlw+cjPK/YDERH+sSPwgvv08wnRxJ+1/xkTK0KQOOoYNP+8AB+3v15r16kUlyX3rNbY0eX9IUCSemAtOlQEqE7NND9vIhC3dZvsvSXRbtsniXZbss2GXJLpvssvNdNtxl/V023WWDXTbaZWe77PMuu95lp7vscpdd7LKrXXaQ+29UrBoAOX8auve4vg8sgoriBe0ZbxoqoBNmuoQJ6JiZLFQ4czsRQQn6bqYhFMFYzCS5yjA+M1lAGQzZTOVABpNgJiI8waRYlQI4wCRZuVCkfm4l2YAE02l+NCAKZtkqJkELpt5MVzAG62HVJEc4KlTDR3hmpQrwg5U0UzkcwtqaiRwgYbXNRIJMWH4rI5a9sJNwNq6sJARaAYLvSFWxs8tO1GF7Mq10QSoNb4ZEUnL7gLwlfl1nw/FQjwqDOmjbgqhW8+B4a6XdsBv1eo1YXVahSLKVN1KpMvmGtHTfxWyn+tB/F2+cnITZXjLATbi6hQlyO703TsRvymcV+Tz10+KVN9oI4SHK8OI5fvTr2hpaPqzKwCBkDjEjj1vo7VJ7M4sp4MJj/1//WFvLHvn1rQc3N/D68z/p9Zd/kCiYfOo9fMBWA2H6nnPDCi7t5JPCZZ3YQuLTxtmN0fSm/iuaLiaP/V9+efAv6FWClT78+aEKwnJzk6DRHfw8rtfrP8P/VpcHHHqKltki7IYbteqNLa/X6JquGmEIb5II2km8clbunOuo7m8eH2/qmXxPM8ln8Uj4HUy5ZoKKusijb5F/fT6vuPqpufrIvaWkUUD+YnmFsY/LJEyhMDx7VPuHR1XHaiE8dGJLd1xRja61mtIXzJxXWavrSiErPkDWms5m0F6Qmbuswa54OotIUTcn8x0N+xrABIgeEoO2G7ODahDdLYLorgbRFwaIviiAaJB+JqQh6XyWG9FYwsf1VriO6wSzW8e9RdOad6N1GL8qijLUsk4Bn+tc2iLR2qWo8CH8EyHlGavRp/MDPfrd4ujf0Oifxuxd9eifFkf/VI/+gzH6D/9ro8exAkGFP6R7KEY/f6dH/bQ46qc06q8x260e9dfiqL/qUT83Rv28MGoeu077RNz8yfFo++ToZoSCbNfUBkGJHB9MantRzGvcBVH8aEtdzWMsn9qDUu145yKzmHVjPI5dPQFfixMQRTABaV419jQvjB0SzuMw6/spJyum0sQOEz5T0MwpPoZxdp6GnBiWaJfct9f9e7H7JqZLDlnX27rsEeX5SHkOpyKPrPWjnesVr0nmshp8ZWf9jbI+lVntfv+m86qlhNwGf4dKvnoWWmljJm1dU+W7cZAjEMURe10NRHFUmMhY+wo3pufr1I8ik9e8N+UWVBoHA/zowzeXJxn6rcp7TTT9wXgsGIvGN19ubtDMHtn9YfT5nH8HnlE4NQEei9jIjcs0ysU3j1WzMilUMw6v6YJPdfNTXUaSkAC4toZd197pyVCUJ6LblEV1O6oAMEqyN43V+lzqU7+s+1o7n/PMhibLqhLi3NzIQIN62/CJQtQTbhjSM3XAkZodCbtWV0PUKji4jDUL5ymaAVAKEApSEbdJOnn85tdZWyOTYtGJVk4Xfhil3mtkpko14b4WfeLKP4oMSzTguQmFpW5QttTNjA0ezVk41rQbAIieFFTKUVHQSFEFUaGY8SDLos/c0Qaug+VrTz/f3Mzm5rcK7w8iCT19WDm5Y5BSCuabS3pNLbI2ReXRXMwRWbIr0/EJf7Hiv2C61CEuBb4nFxY8wjvKIMw2lGKJuLeXkEA6o+rs8cxmYREBHp7Q4Pk0mmeUJ2+BsG+upa+B3UD7/+Vj3JDSONUcBtSh8dXq5I2DNOX/ah3rvI7+JImNyY5gJkyIiRBixHn0kosVPbVLEI5XIi/uZj0/QieaKjAQVMwtRA4TuW3a8WAn6wdTszH0RyhVSoJLFdYEn1W7/BIMJpQlvvqKNIA0YAxqMUuAPF8lJsPI4buQHHi1TMVBMj7OuXr0d/SOyQ7EzGo1K1T9gRvjVlTPKy9Usba2oLdR1lbuWArVKJ05MjQVm8M0zLaTYF2kwoxbykqGpI8jcatvODPC9EeFdF0C6e6KhoXx6eO4ur5yKW2w+igmAFUiCzmfFrBa10o0e+a08UbF/NEBdyjubyq2jbiBs6/4FdIX56NHfcoX1tKVzXcQ43HcwNfWat7VThQoYxsRY0/5HJszOka7MzheG45dm8OADGoYDfOzrGoGBNotp8hQYPIIsXe8gbHl2pilgHQlFM4ysx+wFu4W+zq1yC+Po0UcAcaj49U4euzFQyWaz5k9ZpqYHzJkOntuHzHP93eMkR+HMMQeUjBA2hmEXzhuvtZ0uf4gcGAHL0misIqcjMICOQkJR/u773feddqvfXg5bD/Hn87hu919/rTzemf78OAdPr87ODjE3zednaOnB/i0v9M5FBl3n+Lf7YO9vZ39Q/H4ZHe/Lcpuv253OvjQPoS6nxwd7pj0az72nTz4TB3ELuRjLgSFZOH1v6l7lfKPEX6U/kSaVld5hngs9O6asu8x/5DBh2kWng8S+iSGk/GPAXwE7iKXjcohBvxzAp+jAX2BESc8cTLWXj6axixM+Odz/vk0igPZV2NyznmmIWbCC1r+naZryD/1x2i5CfNwep6H9FlPYp9nmY7Rji7Cy4Vg4tjLOh0LwHhNgrQsYs+qmY2syGxklczGYOyfjd0B+stko9wfjd0OipI187FHFpyavP4QBuO9YLpaoS6OhDYPQUT0tcgpGH3xJqOw7U01Bo11pL4WujDz8G5MdQC6JONwraJBq82JaQkVSouKYcXT1Qoz3YquG8wcB2F/byo1gVFVE9gAI+wXsaMoI+PICKjk2K/kZdbWRDLkN9iIp8DvAvdpch1ET6Xk5JUUSnl3HFWBIpYLHMlGH7X/U6BWOGoMgBC6pU3KTVHcmgE5/IKMQCwh3eK1qlmyCN3UIwsC1F4Kf7Q7DglRKaN5Qmd1KSOHAWr9ALzuykerMp/FmvO1EAvH9TAKhvqpVM+QepRw8qdd59//lu8OV9H0ZPQ/VDOgOfM8osQ3YCcPhAFOMc4b0n3+NfYfHjnsKVtvKXPUAb5zuuPNJVhsqWCuJXojeqxiLLRmA6DC0eq8IZ7qwq0Tij5rGNdLKxwcQuPCNm03hlywiwGVoAcqtD7jIw5X4iRep2cei5azmxv/tRuvJOkgTDHrabgiczDKH+CIV/hWyVbOzrN8ZRRchCvBSml+XW/lLAS6drDxh7FLr41dumohDDSVl9FiZGxCLtAQW60E4pLGkgslZFj/ZMC4SOfrzoHc1qnJxhOna6WQISV3WO4A/kFjaHzshDo8HF92ilSb6gbakqODIpu/u63GUXSz68U5PP3zpv7rzcMHHjxuT4KzaTjwWlSJdA+ee4WhGrAtUmZuKJFV+FhCgyeM+WVkbkPiw8zY3WjI/CgkyU+Err9SlPsoqYCOgvWfITg6HZcFR0+qBEdPvkdwpJq7FKBq1C9hkDtUR7ta+QVKGpBpwBWgvDcBX1tVs0iQw3gTyHo5T8grORi2KlM5IvIaNn+nMK2K9wgcYzRXbePyXRhCINh6ML6QpWYkSyRfiYhSbDruEbIbQwI28ji3xGIVYzTWAUZZPOewE5ZFNrng9SvPcimF4WImHfmXh1wVqkVk/BH+6TrOYy7tN6oJ8qoajAjCcQ+zkRykMidHV7FG6S3hzog3KaXsyJtagierstgMgSyd5gbY0QqhlKhZeGCLWV3EAFL7PpCxxKXNgpf55ms36LHssR9LXVyd7GeILC3Jk+x0ezKxhIZS8OnDqat75bGsuSq0UjbwZGpKCkMwtM3AHtG8NOPSVxI2TW4SF0msVL9cjy8RSteI/zPmFiUymQkPhoxIzXezPK1Brc62WCb8QViFEzXRk9JEJ/ZET3oseOQnxYme9PykVp5oUz74I4bwYwaQPPKDOw7gBDDrgKC7SvJEA+FdF6yEpb+NNiKmKJu0zANVDy868c00qhKPXiWpD/wJA8ytvPFaQjDKrnMmjHB8wNHAgv5KSdnCerjqb8XAKRdHkTQ3UTwM0514UG5I+kIIstzw1WUL54wUFHkp98jcK7PxbMjfC96y9TvlKUv1jRysqlGP9hkulIW8VFb0YqNcNIh3ZTImQEd+F69KLqoK1Gocm/lWqrKulBAIPMUWW+WKsNIGTuE/ljQLmR8ZGZF98QvfWeKLOQgwfiLwLQxDRazWpRtgnZUi5A1dU+hq1WOE+AH4whlDS6eFp4wN98gxCe0P/kLGFtQT9NViBLjgBlR4t1Rq05ONtqXEILOa1/Nr7UCqT6sOEuwH0mx1lGuJg+LcOTWA3dRtbqMA48c0SBKQ5Y0pkcqPaVCJZG5rlV8A/5gmUU60tL3dwQ9pavfp0lb2ucTrR7QkBGZLm3tD0rcfMjAuvVva2mHw+Yc0ddhePqojKYD7Ia0pAd7CNkm9bkFT5Ai/YGREPqL1KYuxmHmRoa/qVt7jV4TX+onHhi04S+klEAFOGhiqSEc9WFvT35M5gwxz7uxrOXnN48kL2hg7Vzh+ywXEGMhVCSMb2vT6ljYoj2gFA77ckp1iwvDc3D/lLfmFE0tZf5rfWn+ai9yL74VWpBtQl+fwjLueU2TVxF3PMEqzvHTfYRmPYaRwdU+CB+pt2Y2zEi99VVFKWVrYNFime4tw7g7GUt7nWdLkcfOZvsHIijcYT0nzNIjYt2pBdVAUVAeVguqrsd8Zu69JSX4Mz6GpIdP5CzLGL/8ZwpF2hXDkS5Vw5MsPEY5s/yjhyG5ROLJrC0d2/0bhyK4hHDmxhSPb3yEcockYj+n6ablUpAobCDXFKuxNtKK0BeHIV1wWB2QSgkhYYA3m2I5i8jSIJpATKZmgFdcgQyMmdEqWFItx8Ak3szWeKU9DG7YhYmsbCIoyPeeGwej137ogldwDr8qPJc64MnCGsbFPxs1vGmcERZxxj3BGErGjapyRFHFGUokzdsb+ocQZB0WccfgXcMa7H7U7vhZ3x1d7d3z9G3fHV2N3vLF3x7vy7sgFFtT35+buyOXu4M5Q/IOxurmFppTPQHfHAANjrd6Mm0caDJIiGOzRHefJLnu/2EJwd4wXcE/H/u64cDfGvo4LhnWWTnuuru9s3b/cI1W7p2M+zBCmsoXafo0c/mghO7s39je7K+vseON4s7H+7+Pu+vHvfxzP1v+nt8leF78d9/THPfjo/n5zfFzzWu7xcbe9/mxr/V+9WZ39OveOrx5sua3VbrA+5OmY0PM2P7PXQUnpMfe/jt0cwCyZYjJqv218PU+AS1z1HXTTRO6BjTQecI5CMolElU9fNqCfevFRlWjdd+43nPsOQ0XrKNsdANdEFqlMmk+0kTgBgtJxgIvdYhMVU7GZPJoI2WFf503geGVDv2+aXmBgQrF7YaWGjx4+uLkZPq4/+JVWbqhMJoaP/F9+fVj/FxpPTHjNU9uIA2tvutO1X3/+pf7A8zH7g63W0Hfd4Vp968FD79Gj+pZXgxz0Vvv1l18e/tpI1tfnAzIwqA21u4j6rx68HE2n0rak5qw4IkrQRkiqXTtIlsI2iD+37o35DVDfa4mq+o071tnY7B7nx/Hx8Dg9vtp6Ij1T6ppuraDP7SSAIokpTpIPq0YhrPoUjxTWj7/BpoUMryu72m8GNX8gty7Ws/n7OsD2QPYn8FoBZl93aoGK4dnYPB7IoKIeiWUgx0OnlmG/jHwegkggNTHdvTFTO3TETtmFwlqna2unAoD+z4PWqOGe8nByF0Cu4OiASUuDaSuqBbWoEcybrwO5CfxZcVHwTtWEWXznAN6Q0M+wNiSGsCJlPf9wY2tjy2m+1yjqdSBQ0z6dUJOIPa9GTZPiCTWpPKH2x/6LqbtHJ9STMel9s2eUxlUyvhRPrRfTP39qffjPoHS/VVC6H6oo3Q8/hNI9+lFn+V7xLN+zz/K9v/Es3zPO8vf2WX70vZTulzGX28H7iRox9wa4lPi9RdvS2XBq5mRa2XV3gPj8ZhCfIvDqEo71hLLMS2SpcitijEEKV9wttq8pEyCAZzae2ILdzrWLXcj6ZLxY/c/U+qOO+Jnwl12t2cszzY2ea5r5mUEsGWjj/bj5XGOiSZFYekYY6Txib6sx0nkRI51XYqQXY/+5VAj7UMQ+z/8Czfz2R+2zJ8V99sTeZ0/+xn32xNhnH+199vZ7aeYPYyk7tkjmFwYUGEv1cdx8q6HgvAgF3wgKhhH7WA0FwyIUDCuh4NXY/ySh4LciFHz6C1Dw8kdBwZciFHyxoeDL3wgFXwwoCDsWFLz8Xmz723hj9+n3Idb/vitiBeh6ZUCXAQJhp/nRMAsvQtc+MWT9iH2qhq5+Ebr6ldCVd/xXkupJO5zqiSiNIE5P4qu/QO389p9B7cSdMrXzWxW189sPoXayzg/af0fF/Xdk77+jv3H/HRn7L7D3H4yvuP8M5zzBdDq5LhhqyRv9JRvu63kwIQeB+8Gyuwb4SIr+LfuVb7yac+PUYi6Tu80Ohcpbjbp32dDo+KWjSSXVgeXkkspWSTLF5OEL+EQea0A8rMm4w7r0cgMmPRvSH6kivPLOLYRXuSFNiqWdu5FiuvQt5JieDXlJEmd/ef5sOEDCjhWWhq9hqQFJq6p8lti4wjRJr7WnjxnyzeagHJikFOJ0cCR5GemJN/Fz0Gl+0qi/X0T9L4iwmEbsZTXqnxZR/7QS9Scd/7zj7hPqn3QKhAV8+dPofvijENv7ImJ7byO2938jYntvILa+jdiGne8kLycdvOu2SMvEgABjmfqd5kvDzWsRAp4TBAwiBvxTFQQMihAwqISAaccfdQRpOShCwOgvQMDZj4KAD0UI+GBDwIe/EQI+GBDw2YaAs++FgEFHWFtZQDA1gMBYqc+dZjhQQDAoAsFHAoJRxPJqIBgVgWBUCQTXHf+yI25mTotAcPkXgODiRwHB2yIQvLWB4O3fCARvDSC4soHgovOd/MVpR2jXfNfNpTBacVwRp7Ws1sAcr+Z4TsNxmrfZxS42tWXxLUayAL/XBvwaQHbVaeYafkdF+H0S44XP89B9AjSHcoTYQHdq487cmN+xBYQ0Zc9iw/Ga9JsywP2ws8tStR9S3bz7DJ1IPom9DdWUKJcnUO46qtpC18UtdF3aQpBCXlOCafieZEcvA6r1LPJ/CwRj1engM3lZYW165qfuNt9u7FWgB/tb8Od3HMD1fwKfdVLBZ2HXS3wWjee7+aydH4WHPhXx0CcbD336G/HQJ/MwivxogK6IO/7m7+79G8dzu7/3fvKO6/c22WHH/xy5BqqYM6dNasiwsVeCeEVZuq4EK7Sg5Ls6iOg7XtgFfdjZGZDUQQ7Q+3mUr8RhOBA2ahzCB+he1/RZug1ITteMI6VN4Hpk7RYGgw3AIO+Wdw1K80vOQu3Q6cHKKEB/vivhcIgzucKLYZ90sb0gHZvNvaloblsuqJgMpcS7Ik2dRThBMTUydns2DfuAFbGU0ZY9B/uQ3lg5HIWibAYlJwOcNIkYBhhkbsMxfdYG2tMbBaFF8zMGtAPDCIJn5DX7oKMZCTKmo0hDEfw86KHnKuC9OgbjhqaewJSlZLeGO1Pj1MERxfoOmepQI2JqPI3c2KO7HWFjbEyuchB3c5MKibpyGadsft90XE9YHOPgeD409gt1RdDpUGHLgY5CKxx7pNqrR2qK7w0vAVa6akT2KmJGr/1cuCj6ElvH987tx3fZ+QqzT3SYpcgrnOrbHa3MDWk0lFgMTVsGFB3RUgbmnMd8B3B3tA0bfpWeqrhWIaN1PhGy3MJ9ycuY2yO7vf5OmOdqay5pp2qHmo1mxg44vV4RoCo2AznX/VO3WTAzb6kX/KC1bb2MFYuV2xph8HAyCAG1ncHEv5XQwZ1Lhgk3L4CtdBbprWRcBTHDGzFZnJSrqraWy9BjMxdD0aPZsozeGg7DNA0H5idSdxVYtGiuZI7RMPKQd1bizdgAi8YufTOdYAiEd8GlwNnUttXXBUrQG2Jq/EypD2x2f7/f2/zMgCSUXgUT+7Njf0a9kqBG/jWlFVJhFbIqSRTaJaGOtPIitrF/cPL26OBwh7t08BdPLZZF/WpdRGppC2GfyHpzE5sv4cbTg6Mnr3d4ETZAoBn22LTc3QE1MRUDfDSRNjTS+FxyfH1TGLSCUxC0Fne7kTwKWnYnGuFGB3hI+SosNwtFK9YuFtm2z1M0XlNZW/YENIzxS+AvAN/CmoyiDbtWwDx2HfaYSLkyt0GyzPks2aiwLHaDPY9cwRl5WrfeAjeKV8ckLD4RsbQIlWULjNnKl9rBnSA6gOM1M1xmxT0/KPvKQq+ZND3kxuZZklYs74w78AF+j5Gbmwb6zglMvzrkjhMOI8OJ10JfPSJvwZG6sGzLGPdyjj0i1vFZQcMV1WiLMONROC6VAuhjwNG06I4eHGAoZS6xyBcUVMd7kAyHgDEPhhUzUpfDN6o2XL7Qfs1qfiBcH0nMRQJ2Lc8VEneML1192ZA11sl8jbKp6vc7DjqTr/lVdxHK9ar1Deep5tc9ZtfkKMPIrCnrq+DYjfyyehocAYNEu9Xz7WAdpEvsYQuJPSHcGc/Cdo2ychJ0kvSlzCcJ6p4YfUvKfeuX+yYkEVi4X9GxoX+LCEP1SrxLfKy6NDS61C93aVDuEloVx2hyemGI+6H0oAqSzMxinxlJ1ItFdita3gPYs1J843QdpQorFNZFb+W+dB11j6XYHodZ0MXBUC6atIOl6RIu4yQl7mC4CHdRQ3rZyUS6Mo904bYwgzE3zybBZ+iqOYHMjMNghNnS4RxXxRk0QPMpazmQ2IDvQHULb2DUl7U1+104H0ODUOkSzVlBwnnAQzt4uu9Oz7HHYUnJ8JOWk50Y94KS2K/wqBYXqBHzLsm5L3DRfed++arrXcfVdkWq/PKbM5Wt8uZxteJgKxKZsQrwaH/A+0EJSGb2SsrT7HcZVJcMwL6h1UeYAm4Bvupdt1QCsyXNmNvViVCiqqr5e7ThgIXm3u83Ckw8UdWKq2IT3wQVJKnX1g4BDsh82Wh9bW2iEjRFJnySm1xEUuIiJtW8gg6Uq3XmyjO7fGKMjOXpiaVVu5lNhQfkRJyx4oXlxN2y64jVX5QhImS2OIuQcUhuyeyHHm1wJ0A9UdkW3FHbNKZ5mDPpu0TXoRUU24bo3RBOf4mbX2LF55B0CRNMrgGxCaaZRDgiFi7EAZ74VeDPIE9jVq2gvTVnaImgvgrzBPV1zl4FXWy455eoXvhkCGCygSlOdZxaKPBuLa0JbCz9ekcoq3dPIxZU33mdFgX2p5V3Xk87/j159f21eOd17y/ceb3+UbLmNCnImkWC6k/y98maZdtk72Pfeb3+3ovPrx1teA1pHGU46CTfuAd9agCzsXB7nWagL3JOi/dIGcHEZcSSapi4LMLEZbX+f8d/Ji/DnxRh4tlfgIkvPwom4iJMxDZMxH8jTMQGTHyzYeLL98LEk47hHMIChH0DEIzV+tZpJhoQLouAkBAgXERsUg0IF0VAuKgEhKOO/0ICwvsiILz4C4Dw4UcBQlAEhMAGhOBvBITAAITnNiB8+F5AeN+R3i00alizUcORARHGsj3vNCcaIi6KEDGkK+FvMTuvhohvxVgi33QskbcdPaC31qpzZwO2PaPs6To0PT/XXfpWjO4xQSDdq+rMXqEvexuXSTrw9zbyaIIRzzby4BT+Qnb8S+ps8DsJshH+0tlMcjh8C8+ifjJJYnieTs4z/Imm+AU4tLgDVHMqX96QH6tRmEWYKw4vySP43sZngsz0EMgSeBuGIfYkRHob8/HDXjY3SCaTAHvVpz8i4Bt/Cviv8ChDL7xf/UmShaor9Gb3pQ9vWMtpADwx/vTHcrQBpgcY+S3Kxvh4NkUHIfHA3McfO/7DfzbNjx87XKO+4//8oGlU8Iqn/9bxf/25SbX/xlM+QU5M4QP5xBNfdvxf/tmUA3nJE8O2/8u/mubMh22uXdD2f8a1LM51zj+n8LnerBh/yr9Hbf9f9aa1bhH/EsOXh017HmP+KWv7D39tqnXJeGrQ9usPMJnDU8BTE6iGhkiznfDECfQK6ybYmfC087b/K/ZEwMA5Tx1ipVie4GvIE/uQFSfYhKE+/zSFruEnDr9TkX/gP6TJM4C4P+CyF8j/c9MGuAEvNYJO/qMpt8CIJ55Bfuw5Ac0ZT/sMQ3zQNCHoM/9wDZ2nKUz9a55yisNpCng/5WmXkIYrKPfGJU++gFqbfFNe8JSrNvaa79ArnjRu++v1pt4TY57cgeQHcoN3eFob0h42rc3SbgukMUI8dlWponJVPNQg4dnuzmsgccVeuDKMvHlTT/3ttjtJ8ICLU5aHGtFNB3+Li+np4K4upqFj/wsupmHY/9fF9Pe4mCb3Hm3fjVOaoLT7FDdGj6508UXsHZ3QT/Uzbjbx5rEdqAX2OPrbC+Eb4Qn6SK+yUnoxK6UEUSk9q0rpTZ0BRpLA/joFcYZRGeJ88xWQun5VeF4nFTC8UbSA2+0iHHUXchcTDcyoEw2cqBMRZRtvgJWN2UPEr18N9KwTOXo3G8EzxOgenhNGxxCfilePnSe4cIOB72zVHzz8+Zdf//HPfwWnfYCb9pPtpzvPHNoCRxgH8ih+NBhIKfsRhoA8T7qQYrgOOIq9HpHpSJTHGkkdtE2X5CGLmoNkRrEgU7N4jsCEMYDkRsZLGsAZT/VB0Mr9wzbpmtXqjbxWm1+OoglQr4+032ddWCOpw2IHCg3XuHPs1RNqHp5gaPAg5Ltb0N0VaIzBoCuL8k5QmbW1+NGvHg+ayfsu7omws1wEV6vpyOYUXrTtzw4/vtlpbLHOYfvd4cnr3f2dRl28bB+8bjxgO/tPefJDesTEn0WGNwedxi+Uik+/zo3z5F1br8GbtlZgQt+yOIxMCNAPhmhE5uekyyRvVuAcZIFfFx4ptlifDdmATRn5GmDX7JKNWYftsEPdxhN3n70TykhZMAy9vOa/Y5d+rvxoNYUUEr2yp9zPjuscxbSFBitObR+vKdczlNpTsMLkUdz0ZtllhPpVffQ/bziq8FifZligFbqzTFhA93F9b9YPoCkx/w3xAuhIPopS8rWfyidERI1LP8FVv4TKWKHdy6p2L3m7AhT6euXJe4TOLF+hI/Kxn8onbNlrHsqibOoHbOBfrmewFBP/ssnjpYpuIt6QXTYQgxopog75glhl+ZCsjmPVsk9G1arvWLV8wap5nzUdJDqOC1nqtsTismsK0csEROpqURClyxeO6OQbR3MqIyI5+aKRtPqsUbSuGs4C+aIOB7MK4wCw6jHTYU7Zod+3B1yr20M2zgLde3USNHZ8AS46WwvFuPed+0ysGe6FEYrScS9JZ9o7DFryIMn30fPgE5ffITlsx2OnMO3WCp+u1z0blTa903WABKh2JBZ/JGAvTxeMR5Jhor9YC5IVlvMY0Yxc5pZrdpkicia1B4C9qd9b1G0ZMYbhZ/RskwufJwkf4bU/FBGU//ivPzx24V8rfMIuHm+13LEf1C5YB3bKdfeiJ0+CBqZDauYxAZ4UYDrwxzC8MW2sjmeOBftauZxQ1aUPh1gOeInqQjZA707PnKR5yG8Xu4cClU0BayZs0vNYhzBFB7pEYRUBs060wEQwDmMSgIwjdlUtABkXuYdxpUhst+1/Cd2nAXIMwwSf79HzU0rfp+ezAT4/o+evlP6Nnu/R8wt67lPZ5/T8mtI/0vPngf8+dnPiSPYoPaLnKeXP6Hmf0hN6fkLPwwF5E8OiI3r8io+cr3nWxmcKoMNQMxTtmt/nbJTo4+X67+F1ru/M67yP/zd4nev/y+v8oHA6AIJ/WhZ8+p9hqvGlXTbVOK0y1TgdfGcA2bPEd99jSFTYnt2vBr9Hr4Kjo2fF0dGbyfxRgmQN30NvvrV9W18Nqj9LmDsi/mSUYM0cf1ORUWJ6Orgc6GWdEU2Xdg8EDbyhSeoe4xESy1+BnO6Z9nDL6pOUeFVtgjQ363qR83VhKurijCI8NkTFspZwzkKggXhqLlOjuVFVlhrQi/VWD7JydKxyBBVdN7Dd58QKS/QXGw6rGg6XNhykJreWdkMehorjzLwcEsmgLzDS/Sqnh9DU/TwsmLqnys4dq/V5FtLO8JD95Mrz+KVkwoCJuWfZK10nRdQABEmE7qZdM7Q4rD6QELxbTS8SykdeRcyho7bQKUp9HlfJulfqB7lwxgD8m3bFoK0yhAvmynsODMtkdAkdZ5Pfq/aiGMisMqat0OVA2iOXOmjcc1xh+wKhnF2jszjkAxF9ICrmOtMy8oOI4wJcqIxSpitXa9xSaQ31tCFNgHgFeTKGRca1PNCauzOotiHrZ8RoNgwnq8oVK1AZ1ENzLMS7qvi9sA2MZrpbPbPVrvGsiFIVxDhJOMGx25Ydc2c8kEQjVnMJmTbsPvnVHRUGEljhMClVaKGVukQgGHqBZ9jFpW8o3xDULA9ApKwL+lw33BfRgiZJMnW9ZTGnC130K2ONlkK5We50+cJHxVU3Pek2+NcN7Wh3TpGSlW5NqVnYH0IrD4d0iKtD5I0Ff7Va03p/VF5KofupKtFYC+U1PdjRX03WUm9uq1QB7qFdqUh214otLebwahqi5hnwTZADrX4yyrRymgJrF+YOW1S3khf1JCwpaU/gSzgC/E5ma2i0VqzpYSnlZ2BrTPiqbG1OWtuASwArr/4PHOXIPvUUMopgTxUmwFswYkPHyi5lDk2iYy64chzWxz9DbrE3AC66mTzKmtL3adRNesAE83ElcQ4bwJ0iAw0favVeU8iepsUecvGSoH8aGAqFZKomGiEc6HHWGZ2wUhzc0pEUqOi3bMjX5cIPpEr/sKejvzdLqf5FjSs8X4uT7DOPn02V2pF12ZA5VMZBB6ZIcV8TxW3aD6hqr2sjoS848Se1EUxgHxoyZBpftRgHBnZamBsfwZdLa7xAKSn7I1gDrXDclNGJ3NVA69Pf3AxtVX6AmIEHVKs3myw40o35M1WkWaAiCCtrV6EcPCGwAOZ2cY2FyStUbMUnLtfep9qNUfmuNUT0xcrX7XLxuhneacSCXeoFUx9r/ggFJkbuOUG4tVZCVIYgaCjVE/yPF3dA6uIHXEZc8517DhvrPnC1j3ENkj0h+hDtcWHcEqigShbAhcfKA9CSRRwEaoU7/wOQ8ZdbGCFjewNToJuaL6mstaSuhgm9AKyBBgjqg4YBZOjKQ0NUSHtInjUCBZ2iGA36uLaGeOhBT/5WnRRyyKuBYRFg9ssz+zGy4UXtQ7PrYhtqqKdt+B+zBftqC2oiwbWGp7dgZ/EOMFoUW7CjwV99lFtQ554bUyqUucUDwp0jJpfvL7RuGKDMQyt58525YzMnIxQ83rZXcVzsiR9IQxA6M/g+fVLbYUYj/DB0d6BDo5ubQ++WZVAzzitzD29unsAE0rh52zRm6vi+P+Kq2jc3I67U3XRVj4KCXUpgGm4OPNxpptL2PnNX91U9d+5lUS2cd9TScr8LKFs2QxqYjeTvAOdi5SZAV7QgQNprLJ5LtRZMoeyRtW4F3I2A61UcF0CDN0r4wMAtNm3Gr/B2BIlm+60YwsGTXHJbcvggK1hBA4lwgKRrPuKi7fjzhsNmRBE2ppU0JCeN3uEe+DywPbjQ7njmvzPMLD7CmzazkDP1zNoCHzX0sj8B/KMKLC6upgqzdjsRWzlUNiJpr+h0xWzfP4plbSuO78A0n8eDpjXDl0G2EkygiwOy4seA3xv3b5tg45TTjy39WBs17NOv+qhGsQQRGyhDBtx2uuCkNgk+azcQGjmpwHZVtCxgvLd/jvo9ad5tiw4L21LTx29rI43vjvwAvlBHgIVd1JMhNHzUvAuYQWX+JBQtrJiktxJPL4eI+7VR7b6AilsXfZ7UavMgxV5YByylGDSosHsNL/eTQegiew67UMogAq/E4yKHPg3SLPwwinJeyc7X8whAGqDjkEtstB6zN4secRlTmQmXchirAUYBckXEDHHvNUjwzD0TVuWLeOueV+bRbm7coGazgJ6nCKOl1REkC6CXbhFmc7rOmEjcHVBH8b4P5+1Mz9vMMGFXDQt+upGlJTmCyWnfzuQzDraNyVyZPCaeUJip1WzZR8RRDo836yWKsiJwDzSNWMHfzgwjYCEUi3ts6JekZLKxdeSqRSRrmI9+UpwPWFQtjOgvEOVXCpuHVcLmYYWw2ZrK/rLZkzb6gTbRn6P5o7TgRUCHtbsI01yDOm6S7DAhy1LfVtc3giAWfKCsihDWAqqBeIs2oOkdKzSqClQopp+acPtywXhn0QBtUMxRMEOOPQxWMqxV10NjZfHa2tCwxAUIxhJ9QT4sqL8tiw7MonNu4RhQ1FZhpies1GdchBIwWUMjUU4MJji9UYbGogMd5tTCHNUugCyI8yyRbVTb6gluy0ipPKGEhoOVtd4rp1QVRs6umPNBr5yysGEcerxo4GZM5sLsuJ4pflWIZeF+hP6j/wKL3YgwRM5roN1EiByG7muaMbALEVmTC5uPTacW1eCvBFzcz9PyfoZsMWYztvVy9MU37vI8tOEXD8qcWI0L7p6/jCbugHHx/G5kczvMnLrwsBt8yALDJvdcHeDo1ic0lcqrperqYJLnBpcXVDu8cK1DdJKgefJ+eJXvhQG6dBueT2hMtoCcu2F4tCVschVuX3QCBnfKWNCgsrwU3UIwCJdAmXIdIBUNzNsLCpYtDjPDdcZSFO2SCo849YDRShQya/ZXTQcoNpKr+X1TxsGTJnxRszLqPjRstSQhdYgXcYZ372Hh2kJH9YofW4sDvRncddL44k+bSzBGa6qdnlgfGneifkT2ljtdgAL+JhJnXqI7vcatBODNzUBAqrnp2JRQqjDoH90FagZ4TTASUHMBTwpqpvZ57J+yaeH89S/mmoW4vlNrDCWIl/61aHAMT6rBMZCwY//SEyKt2ZztiHMVKJj5vHmJkeuzD1E+ctE1xtra2E5ouR3Z10uhfLfFLnX4W7ZTGNFY5RrrXF4DCuM1pN1SIQnb4oTlpYptpuvnX8Y66lljR4qa2SLoglolSH1O3CFbRnraIDZcRvp1OD7fUVt0xQasW64HNZMLm3Vqj8+go4MJX98C+1ECbJsDm8pT4iyoIgrUmeP7VTfUwoUBXQJbUVDVHZZxW2m6C5FI9iSKh2G6Ew/eiHyuVEFbfj19OVhOh8zLCGBB1gUyDKuXUzpn5DV3VLjmjqp4Vmn3VXnoGtfJJXb4T7B1kQ2DUfVQKlnqQmRa4ii4Nn1BmYA+YYmzKMNL4ifKlG6Bv4uSIG9FaQoX5XVSWVqL7O6CqY3OmGaTi7qjxGWoio1NT3WhO11xG+3xW/Qn/H787i3+hXt1bFSfKrfMtSG0uS98gitwqTn3N1bItwj1BL3aBhPT6y95vz0+XjkLrldG4WS68Rf694ZMQO/cx5v7d29E3zdV7yQAqQsLiZpcivro3dysbim6BbqSL0S0yG55VWR3rcb7jBlcLue4vTZ5vb20xvM4wnCXwQSrLRAUOLWckgeGKi84CSt1YTHDprM0yWBKXFwuwNFzg8pfgqv223fGVfFd9DsWiv/4hg2zJehUkuzAgdabxeML7a3W1oTTAd9/1hZ++JV/zL982Nz5qFlw0DCb6yClk2ihQtUdNI3ipnc7NVEwS4FSEhaXU+gFpgvKra+zuKX5ByD0XWtJ+NwgkehfDKoVmgqn7B1KGNSMdVD7nBOeac2dAhc08R3XYf3/X05jv9TZmsGYGdkNFnuZblhLgtFhItWy2/GAu5mSzvjYhE0Ea2bu67IodWKIXJJqKUtSKVjpV2o83yYiSRaghzlKEm7RYvsr5/s0C88HiaXCqgNxk6tvlKVmlQjxT5HxRO80vbh4S1Cl2rdaWOLKYXcd3vf1PiA/vHUSr+EkJFuoHiswLl7zTlcRdAwKB7KTKP+Ah95qveCDEYYRsMgCndelIyE2WCp0/LKASc8WnQjJ4zqibnWAWS932pWRJEL2ooy8Ug9MINHUZ2W9FukpLnO+ZyVuB8Zl5I4CmGaRPZPiNUXz3CZeW5qxMIeiiMTUMcoTNkIM7u1W+kAX56yyyJsDs254I65iW6MKEcxdWFDRtaUQYQ57ecYCZm65JfriVv574UD6hjiM1rnS6evtHGI/+f+CQ1REqXVJYtCFaiJJvFsgv+MqMXKR7i2KlbNbh753d4IzuxN6YVHl4BXOK7DIyraNnwpBYSZYUtylwdoaKipzzUkmVBqZVPRgRRXmoKgd3CyT6IZLZt0OXrfWUH2IYHTXNGOBhZgYAhvjllWvYH9trb9M6pSI8yqFfkdpOKiQNPUrRE3z4gQJ2fR14ibM2XC8kqnJKe/ghZ90T9fr2AkcA7v2N38/HtSON+DP/7m3uZEDL+Qm8npk9WJtbfV6jneVvOb/rq5Z+t2nqld51VBqKkvNHK85VRSgO/AHi2tZ/Z+pWrVTdA3M3fXg7deTtjYfOWq73a2esLpxh2zgQc5RWaZ/yi48IcIddS9q9d7NTSJ16i/xRoGkmKfsmpb6gps8K5Ig5jaTGbtkI0vbYYxmywZJueN3qvZBDdrssUMfiLsO6ux3ug96tVP4eSie3WuUymLT/zM0hs27/MQXe9EQw4p9eGjtwZ15c0ys1lO9jYPUfaL0Dj2l8fg/g1Iz+3+6ma9WM/uFZmZcD0xWurAuKPpOFWW85nu65nfeXOOoMRmKklLkvBKxXNo4ZQFC1cF/KpFqy70NnYoTR5NuEZ04aIlTJHJv5YUEI8TZu9Ut+05yiRxXmyUpHR5r5MIgYikpWrCO0CSE61Wri8mD9oyjRStP0ReDHJYULpTqLDppiMR6lKWPVU0JNxG2F+piRtP7xFfT+8RXy02F0O/W8qfS8NHnBB8QUZ1V8xPo2QmK35UZRkEgVcymnGwIiCWRVDEXCXsbZZ37EhVU1hc1HPpXLoc5qVVCWSgka1OuOMzMSnwNGaUaXPnenCTkJdkrUAAi7Ac3qowy+sWAUOL+OIJ9NMXTGJ5EJMYVDMW4kqQrTi2Yc5nE5u/dIIyS8544x9ACyWs5Qew0nMBRLv1bleJ0p5ZAfagucZ9x1TxU1MtQUU+GelKqevFc4IHFlTia+4m5aN064qsUZMqqWy2oqxFhYYsSvmthUVYrAfmVjkkrisbUsqygUk6yCNlKnBpp+9mFBFCrgvaJPQwnHkrMX91lvF3f/H2lJimWWHkdL6oNmsyR+cItDGLUq8Fb28iMaI3KlZGlXClwrgzs4kaFy1bjq5mTlAotdK5uuoRWWm5dZS1XliqJ97JMHNiV7AeLbGGQYoMXapfY+p5L1LXQpZak2GM/alafbrCfv7W7SzVOeijqqDVxIqL4PLSiOMnTGkN5kPMEEelBTcNS7/CVkmIdqlxSBH+6DqAgVS2K0f/TtaxjLT20VQekZjiIed9uXmlPt+Oi8902+Z7pRKxT7XumU/Q906n0PfOi7X9ou2N08KJ9NHxo39n1BjksXmqXToPFRD+/ubHiRqov72B7kI2LZaQeLbVm5nEgj6YDgN+OMDEvIIiFYetK3ivMdlHZUkV8Obfr9/3Vemu13pCW0KvKCBo300mUvUZUs2zvzJSp+vJOaJQZE/6ahFlGzVNDZKx+x8EiKf1Ck9LiIv2EEPkBb43UjtSYJTVpZalATMJtgIjewIeO2Iz38DxerEtrBF2xu8yws2/SBAiJ0LXFoHl6LTS2Mz5+qrUpMsPBkSWTi9DlAOVOPG8DDqi4QhdXAL8abiUkUeVkpjNRkYPQ7Z7yZuAPPQZ9CuIMkN9Zo8+wSyjBp6yN4XwuOkBBbfoUchS6kMAfdf/nyZnqXMPuuONy8ulWEyDFIzTqzBNBSgR8BtQF3/RbxPUPtMW+I0e8ApsMjqkMnnj/SK1gyqeXQsKuYIwSKB4n59kK8sIbjgwwZs9pXNg2qj/GfiHV4mzB3CbW3AZ8bjM5twn3KJDlS0gYnFVKLUCBdmYg4NwTdVUsQbE+zMLrlDtE9fE7e6Lq4d1Rr3+qU7oSRg7vcTG/s198wm9upPKRWizeT9FIRS8tUDU62bxD1fwgNE6r5+1mRx+EneJBuI0HYRxWnYFxWDgDY1PkCi958Bl/hJA41s5K8Fl4BJH3VrHWDoDHaIB/pQJSbOkA4xteT6DiJr5ou1bj4H3b9r+FwinbR3rmjt5e0TN3yvYbPXOnb5/omTt9e0nP3FlbuI3P3NFbTs/ckVxKz9yRXETP3DFcTM/cYVxGz+QMTh/+38I/dfgH23rtjaAZgGDe6kMn9OZNayKCbY45Fhb+WCqspzThhScLC78qF9arM+GlzxeW/q2qNC3zOS86XFj0U6kowMmQl+ovLPWyVEoCWp8XnS4sGm4XiwponfKSg4Ul81JJgvcBLzdaWC4tlVN7ZsTLni0sG5XL8p13xkt+XlgyLpXErfuZF7teWCwrFdPb/3pbIJBDRCCfqvDHpwL6+LQRZdsCFsSzhCp6VRCKb+3iruclKCh8mPqH25SgIzeZ2fYVA/qOZ9sXAGHmQY74NKHnN3zRja88hXrkH2wbSTv8ptQ/GFDikZoPfDuEScVfESqRHuXq4ss7BBEDiQ1DCuDCDkJ2uu27B+RZ/CDsDkMdrZt8wPG07dftTsd8V/Fp7MS9nf1DI2X3qfEiQpkYKVzLyEh4d3BgFu/svN7ZttvoQN+sOg7b5puKpSTSDOx4mhjYUXqG9A1vkafb3ZSuZnuGq7DQCiQDdYRAXIbyBpe76jsZ+EchjxpDvJA5h17ThqgTHr7hcrtUhKaYZ9fgeMn3yUVFdrUCXrMA0Re80FVlIVwhz9oPVzz7uJx996lXBPUxz9wpZxbL61lQ3+HZL5NSdqFhZm6Cy4Tzx+W6ES54VoLjNq91u5xRQgzPrHbANi9wUlGA4Elk53vnhGfeKa8qwBrPibtth6/kTrlOBYReYaPubBvO2g3vhzA/LgbWTJUDAfFk6fQ3GmhWLb9YdmN48dHgUixnWRZunL0sxzBKs3x9EuZ3zAgY0TF8Ch5sl0e1SkM1vMQbeVZX3VM59stgMjayvTOrOsEqbm52qCbppACx/6tK8vFVkXykTZTwmFWCfR+H15l7kXjl20Zs1jd8ssI04KuuEVPQfesrWKpXYTflfgzh9+bG5e/05omOXiX+9qDQ8NUPa/jKavjKbHic+IfFhsc/rOGx1fBYNCwDEuYo5GpHbLdayNUuCrnalUKuN9v+1223TV6Md7f9p9vuO1vg9ebvcVb85s7OiqFL/wvOit/8X2fFP8hZ8dftP8U0dZJFFOsbm2K1hYSdBMAX79QofH0nMRqhZbq37XcScw/c227uata5bbLOqutnue561xkCgdqJvmEI6+Q8J8SMmjP9yfkgRPBoAaaUuyQ0JUswy6EfujPUdLKv7pDWwW94Awcw3iCkgO08C86iybWDVc5uqbIJIwaALVc8Dt2wW+9Bv6D6hhIQ2xlhzXPjrrCRzxtd5zS56oyCQXIJQyXZCUnjJThYiU/P04B6ZCWGk8DOdhidYZRt2X3moFHO5xTvD3fPgs+hlSImWSdsJxP00oJ3Ghk9BHF0xpv9UStgzAGtRNf5nEaDw/BsOgnycJu8kKJSpZn6LiE/KxzBSMWDv9Aj47sWAcLXcGMSZbm4MA890UXZQ3SLi8LP5Q3klJl21nbkv3FdeVgc4F31q9yV58kTujTZ22UHicwCybN2/g591r7eZvT7dDD37yFb83XgR7kZn7ItnAgTNDZRJP114GLgsNyP5p4pEEPszqW+kTT6SvWcOUCEtcJWaOjMYkgVdZ0OMBo19PdoA9hBjE8Nycq6cSPI3S3jCLk3MPqGrn6Uq+EQT2nsJRqlKLVRIWNweInYRwlLEtNqNSPtAW3NaUUbaUgqvURBwhyIzzLZxXCSsSHDg38NuxDeU8L5TJd6Dmm2Ci/qEddzXVuD7keMABUzoguK3AgAbI2t29Njk8IHbcKNA+Ujwp5i5MywIlfGp2M1k2G6sUiARTJoqHkPo9GjRRMcHVMYCF7Ufh2YehXamhWhW+eK9TQi1HPXKYE5OfPC4F7E5uBS0hl2+aWqiM+MxzAdPUWV3yYvFfm5LCVL5DjhClgMP9h75kllxhRlpHrhx7zKAGeZ4IWgJ4HpSlTz6OEX9l7cwvvvRM+uD+uEYTe8hs4b5CJ3wle6lXYTumDvtbDRBM/pqHuSoK7gah2d7wnnNw31hPdC+EEo3VH/EoyJwyeaqm100aAU5wy/Tlbw9sNL5B37BEFarhBUaDhq306kL34+k6Q6N9C1Mjk6OLu1GoOsGN30ixm3CYI9C2Jnc9W1CLuWenk3ouhbEfr3tr6F+E1trc3f/73JHIeH6lKRqFQz+3w1AWoAus5cfk7ilekZ4Z7N349dd+Mn79i7t8mDZklacqaHRai5ASdRFvWduThp8VBVlbhov+i2GkAReC1Ayhs1WZ+atrzLFUkxp6NJxWGanO3E0DdAenn3QU90U0SI2TzOapseNDN1A/9xN2CrQCJw2zmArg2g+mRveRfjJJmKHmY+lFhdjbtBT187QYFW5iP2X91qkO8TzBUQGE4mDt7cUgmPzbjvuayRidFjvxFQM0d6CxJtnsfjOLmMHQNkntCk85kW0bm4hluT6/rBTiU9oSDu44n1ervphdKRPOSWRljqMlvX/MyoOe3uD3pyzSQe4HuIW0gohEFpuH3RpX2GkWzYxKdOYvGJwnlunw09jvfQBxBuQs+L/D4UHLLAT3StA3hJ/H55h7EBbmQB/AP0NJPd3CRz1PFuBS03k59yvM/jfQ7oMJBYqZFqBJWSNqYLOD/ig+43J8pTASqW6J5TNDNPYPaR32/2/WFF70Zra33ZhRHfDKe4RNe+O+0O1lHjN/VEq3yxrpveKV+ba4xddC0/qmpQ75hcRaJtQzc3/MaLgfTRvxTs17PkIhQe2E8Sv3N9dppMXAeF6khU7IXpZ7wQdTy2Pyh95QZjmWOQGl8kKMwAWoKzDFhGYEAU3OYaL0UchOO5D9iA83N4e6wg17MjuP1xxNNX/n1vlhIQzFeoCeApgIWYvewc7Au5fDRE2nH+h66TIwm1YFkBXUpY1H1DnCkmpw1MHC66srucE4j7OUsR//t5azV3aaMC50YUCm13Eo/pCQXW8J2YNZiug0RxN27KCUWxffbQWOgsHEQBegk8n1ImeASiPSQyW0ri8TPKx2C861l+DdX2oJOn56enE8Tu/h5OKot4hYOkfy7CXyEHsz5ElTDmjMPrIc4gNrB+GZ6Oo3zdSjtLvhkJ2MB5fJkGU/LllG5IOEBp7c0NnJnrmOJ4pWMANhwRCFmYXoQ7Z9P8WmCR2QEgG3SjE5AEjFO0mYvWEo9nAEsJ0CjdnQSPEby8nSZZ3s+yN5Pzz1HccMTrOtKE4cBhOMM7V1FOFWIx4qHtip9tqyrrUCMmY3Z+OK9iDLyA9fFhiKREwOmIAfRmYNMRLXeozQEmPpzHgY4ZMWQTjyrAMH6rWzAa+DOwKY6ADdAjEJBRA8jtNQZF2uOuLQxoN6B4peVSQznWzbBFBFCrkbA7EFSMqzsm81s5oyU561bOPnpwI1w0sIYxCPsT2HPmZ8BJt4zJY8naGspZVrcM3/Eqfjb0IRAmZtrxGxJZEpEhkWRsrw0BIgQ/PGYo8VL7u+xbtWwO8zwb+Jvr7vHlzT1v8zP7MvCJKPIfoyj4CNCAdFj2bdtPgcUjOsbyZMZlBZMkyJ2WA80/o0fAM6ZIe/0sWwd+ChLPT6F1t673zbMBtIqHjp3gNb8ZQeTlReAbDB7vPtll7wcGd7hytO0foc+h99v+7DS5ejYJrxowfeLxOTDvU3znQTy2gZXP8XUosg15nkv5zFnoi1C+d0aAacfybT/8HKivgGA+hNHnEdWHopjtSXA2lS8v1KdkGvSj/Joe00GY8ofpKIgzfMyDUxQ24ONlNAB2Hp++cdMLfEqSM2oumkwOdE0wkck4fBpko2Q4zMJcp5UyfYgG+Qhe5/r0Oqy6JuPwRieTcHMLJNlW411iiULplSNx4v1v42PFJvdC3/m3U+PKu0B88FMTBQQ1n9SwRYqSROQUOcjsC6VAzyOvUZAfwQePPvP9R3m8BuXv4l9GKT3lejOyUZxksd8l0qdFV2s79RT5T/LR2LM+ojQyhj8iFqv5yY/n5fYIV3gz5HaSaXeLaPJ1PLB5Ql0k3NxEggqlT8IpgFZzdBp8d6BwjhdthP7RtsufOWWF8WeJCW6u4o31vhQLAD33fhsmhRTXSIeQdq36jKRhdIa1B9i8G+MCraoU57YVim9ZndhaGdT0RXb7vd7w7xKx4T/EuOGf7bK31oY/ibj45wVgr+PsJ901eLm3GbEXgAhQfLiOO9bBfaDe1lGWN+VpHCGs9xEjOCZKcGTOS0e/TgVeMJIyQg1GQiywg0hCAuSSsABPQKyAhtFnU+N9pDPcgiccQBTrGYolbVThfFsn4wXHxBYOoot1USNvjiOD9YFCGVZyVdZLRByOjTk+WJJ0TQC53fb6px4eI876vbpFGgH632TiFLDPD41VPgwkm5+TGi0Q8+oexbVvSNfX8YbUDf0PSPlpaESK9PzsFChGElKRNfgLBPQW8nRawNPIAaCnVwDHXFYDdBU/wUhaKU4zhC5ur5Cj2TZUIMfzYkCEXsqB+QRl9v2JO+N7kAmDXKZgEmcP5W3L82MWPRnPB7bMAwoFRNcBHQ/Ys4HMP5NsR/ch+ctGd116ItR9kysEeMhl7Sak8a36HhlN7pqSU+RVeYwndSMUAb+b99gqec2xrrciCwV4HqFPjtj+7Ug2JJeyin+7x52a5x5nNbd7/OH4sveTB7vWa3FxRcmmSKLeACUvkQcTE9I1EEe34jXSJpMLK8h4BR+wBPBmogJjCGLGWoATT3iMLFfLYGB9cPZIoTeUWMxriNqg/bcae5nXrZzVwfpQH1iJp8RkMxWo9ilRNl922UcL0T3f9t+gFdvHitr1tRRwSlkyCYEA5Q/AB6Qxqq/gL0B85mpGPRf8F0kkibkA2AGSJ9/udJymWYEb1ZwGnMuwc4DjRoL2OWw3Goi6m/+NSMxvu+yV1e232xw/f9z2n0L32att/wP6tHtVPQwuJnlLvLEYUoCqzCtaUhxcBhFkkgJ8WIgZHVxp49U2QxlWg98mawngx21Yobns6Evq6NEu+2R19DfR0U+ioy9FRz8tW83fSHCjIgHK+VTqtrDHZOdeLujcp23SwxedA9oeOvd+l4Ujs3PhCS0+y0+oUyw98X9DMjc68V/idX84Up2cceCNhteN8IRR4438hNEsNtITRr/RiWwQOJB0xF7ssg+77DkcrrssGpm3MkBhTNGwndRUR36SymtJKGO8bahWoSIznToANZtp1BdoykzDJPOmc2LG5LR3corsw3AS5HvBFJD04zB0uyiEGhlBCrlIoNF1sn4ahrHTm3s9decDG1WuSjqacxVxIaxrQLuk1UB2HyP2NSldUcUjnJEnpJQQjei6SvX6POXIGtnsmbj/d5Q6QtgU2610vdaC/mdG/z2p5g77QF+URsTVk6oYcvUC3DI/5sQamhcAG2mfjw50WLj5DFp/rN+bpfN7s0wZjM//aPwh0uZ/zKtu/lqReVxyO59sxJ7H5sRkNCd4/2ZNx2Got0qghqe1gzUWDEUfU/Yld8MWccAtntZqiY98UYIR7COz7UC33fwU2etxz2RtoOY/Nu7NqFPzP4zz7m1sqfxBoZ2IUow8IkUFAcaFfbrzrH30+tBppY1Qkur8QX3hM/5HIyyuilqLsPR1E7/qj/S4Ts80Aa8tkByi1XBx2K+xr363mzKA5V6PzbjXhqfSvhclPRsbG9EcpXACrZJqQSmk5IyO6qM8mgDBy0XwoxCojmDOjeVJgsRvQqieSeHaPyFT3qTRTXrNzJ0A4TQ4B8Bz+6w7ZIMejMLWmuizWXfYa0z9xwOVd8ROIZ9d76nSDBEFR1DwFBrrNU6BIJp7jYrPvUaM7l09NpuLv2yG08AJr6yRtypuQkRSKF4DRD8tKCo9YbjdPg4D3VkrgAByAPPNEa8TkrVQ6nZhtQ5zk4r2y8iuAavIUrp6CcWmz32xKTJKhtMxwj2jfGq36LUBLOhZBOf/Hy78cBK+sXJvRqlz7w9g7s6CK/ocXFmfgyv43JNjfJIAJRDE6sI/QCNrz9i8cZK3/oA/K8FkQl/vzXIAXSCVDDUGmoqPJt4wZ2EvsXgJfuk0POE3Tiapwm+lWCwdVURzhvE2eYH+CVpZoaC7E+ZNC0IzbzUgvSnn6e67ne3D3YP9DrpRjk8oNQHSPt4YRGlI/fETDHI2GNi5KSod1fHmdfvjSeewfbhDlWRmJcAbXHfyIA91JVZ2Xcuz3devT/YOnvJKArMS5Nn2UG1c1WFm1lXsHu68a2P3TrYPjvYPqSI3kTXd3ExPpHMYqjbKQ64fQ8IvXXm5Gt3E4e7e7v7zk2dH+zQP2MJEN7Ak1/nJRpYAmp/4jxMTxQFKm8zdP3iPcksTR/eoVJ/u0NMj3lfqyUiOj9ZPaP8Yy6fyGuV3YDkqCqOWkFGS58LLbSq1397bcSijuK0BxlM9k1BavcnbcK8BOUhQrWrltWiLUREvOgbKDKi0E5acsMkJOz9hwxPWh+cRm8KrhUDiEwnhbteJk/QsmDjMSdH9WIY3HAFu2jjIred1+R09C5oVpOcxcgbony04z4BtgwyB3UIc0h1KCrzAIBOKUOo5yUdYJDGLRDFwgABq+GFifkAxR4DXOGFAXcWf9SiWT8l5rhPFW5aH03UCHvkSxtTJ8xO/6/TPT6P++mn4LRK3Q+EU72yGJ/7mMXNbq93f3d5Pxx7KIvqYtlKzEycjf/N3d73VPR5s9Gpnrcy7twkzjonHA7w6F3TycMSuQta31mE4Qkl4yTYYjpTCoZGKE0PQrG4XSEQ8NMpMeqtQcoj30BwHul1gObGUO+uGNe6xVtEZjtNAgiICuqaHjiu8RnfW/YOIhh6g4d7/y967trdtJInC399fQWG9ChE1aWlmsnsWCsyxHSfjSeJ4LOXK8EggCYoYgQAXACUxNPe3n7r0FQAp2jPZs+/znLlYRHd1d3V1dXV1dXU1aO8PcTiby95Mgat0V6bz0Ptj/0/9s3/3bIH8riIt4uh0nxquhDMeUx8f1z35mjdYL+ew0V4t0xgvqFbRQycpO7huyEO/eNoBNutcs9ZeXuOt1X0v1LMJxDboCKgNX0eXS/pwA8IlqAQsaGrnNSKnBCJmqM/1MUCJVYlsMLPUYG4qaa0/c+uv2Twzf0fhjMhXhs8W824Jymawo40FWhjQNBrAmLSyFp5OGV3168xZSqWewEdHoCGcDSCvREUQ2ihgsuVZ4C3gO4Fx6TG0tw1UQQzX5agWLaUhv70gUMd658PJiR72VokKC2gSPYCDOjXAqQKgkFKmz/O5ayb7KYNdXoFqAvyq8FcZfo0X4kE9+DrTD55wZTiV6gRAD+TduU3Ofl5V8WKJHFzlnRJ4GS9hExtzRHFVQ0cOR+dyDrzP99mhHpDNnTmdtvc7b1OUgPjmYIbR4lc3nSLG2SFng421RXgXYSvjw3GFwv9cNO3BrBHWyvlwRHHx6UAVpHNCFf8g1ujBgfM5p/mcbtWhCTKsoJwJ5cy2as+NOeek/4LWNcxFOgqHqcDz50olTsQMEmdigotkmOtYAbArsg5ccjxdTk1mamemeKI+MZkTO3OCR+IzkzmzM2fUqeFULEdhIentDQDRySgAnFLtkDXtLc1k+sndEDevzqGbPMkqLyrGSVVExbonLS1GMg7jUVCAODT1giDbeHon4gWFQJrirh+pWuGrIIHclEr5TvlOLmlLv+zaRfxVYU6mki/iSVrq9cm49FZ8MuZvKn2ErgI91N37pPesLnr9FHis6OJS61+jqzrbLaqal60DhmcEwb6aROcMKsOTiserI1is0Zea483cpQUZaGLxUyyyStzEYg37Z1dtQSsWRQYje1aOob9+zpQtYYWfE/znG/wsIumVTdvW8yVmvEB6/YIlfsZAbzdUAkFeYInvEK6Mw81knqTTH6IiwZOP7ga0X/VRkO8PzO9PQWU77jzrfOqhn4t951WCljsKOpfWoI7AvcbmCwOTkPZqIOj+GuYvouIWSw+7G+1ghJd9QMP6K64eQ6/Xq+57aPLWJ2IwhwHhT4NAFvbFhxY2RUeEBZ8r0B2EIVdtpSC4+RzJbqW6Q7AgqXOJ3nhVVeiNjjDENfM8nSrq2AkEgSr8FCYBZ+svzuNrhS1di2lasVeR2ZMfnZ1X1nzzZHwsqIA8GMkNRSTv31farTeO7ZMvU0D6aSOvE/lkho9+21umnkTOJ0z5duP/TETls7iascluu4OtBZnZ1CfsM3LYQN2AzAM8ZskDuubp84/hkDmbRo55mmYa7HpgfxXJDPxhpedZuqZ0/GGnT6eUnFVzTu1Cik9ZsGpmtTxMwkw5tfJZD5cGctRzPqkR/Tn07pIyIV81e6AiNVmi1skiOG1Mp9+N1JvapFIt+CM8Gi9u8FWZIb03g10Y4o8RIq7usQlvMo8nt4iThwfmMFSLRG6ZrbnSAxXiHquIVlWOFhnsnAzpR1tujoDHD8UnXJn51Sui7EbezkJyqE98PbonRwTVmzXtriersodKTUKSYA6rEnD2fdzFKM78+R0U+XEeZxdqs+T5A+/P5DfZ6RJE0KE/PulD3WWeZPiyagePY/3OpnMcUHZn6wWe/E2jiW1rHJCUYxIx0YSfdPfiLIIU7NQ0KfnnSHmCu3udyB9EwTAS18fBk00Em0/t5w+J+Qj3VD6+gJzqzW9u3xEa5KDrBLkv3cY35KERAPxmkU/pOnqQI9vkg+F1sEA3XVwTu16fXTn87a+/PiULP15EgFWyc+yBntMOqvLFMoZqD2gD4Vqa+K+2RiSsAdjW6VDbx8H+LwYcuvjcvZio2T4Lv1ab39ShUwpqX5ACca17SsfkCjHDa0Antt6Xd6lKMee4bWP+cxeeavvoGn6vP1dOiucnJ2veRt2Hs+F6dH4f8t2iebgO6PcnoMTjj0+8TwZ3J+FZgNtKrPX4mPI73vExxqDujsO1fuLNwIxD9QsAVKvoJKn8yef+yfREfc5PzsTYP1nqhDGI1I3UMlsM9pkvhm+rEW0ZMbznWxahR2cUxEsbeB9RMNIKZt8nx8H9PC7i7hCKhZQ2Eh3ro/Op/wktREWVNsAxTYPTB4FvBR9sTL/ND8BjQUC9MprhRFSTHZeFuCh7sqYeQwWdLO9xVpxNYl+qOVwDgx5QB3/7qJFNQVOx8JOrUiEsRGO1Mg0rkYReH4t4sN/RIb4BA0xDUzY0zk7efG+EnXvIP0c5f3/F7gZUAmZj3JtFeAkN5CEajq5VRdcdFsLokbLOV0XnMkrSe5DjnZcXFx1GUxqC0cBU4oFJ3rmmyq5F536eTOZAq/vOOJ5Hd3HJr6/BfqYTlZ1rwuW6D9i+nKPEttvFaji/Q8HXcPPQSaoORsso4nSNpeZVtSyDp08riRTG+5zki6fTfFI+XS1vigg6drNKpvG/cAU9rL9H/XVw99Bsh1RCPSMhdzvWAdrcYxwfHCMosjAJrAxznRMUiWRUv3ya1ZxkMh8DGcpRRdeno7PmGEnkaPHClU5ppDhsuFx1VvQMzbWEu2YTn6apwCHsLFZlhRHs7oAsuMmXdQA9P3n1EC2WaRyYMkFnqEkiOl4feUA3i9L2+hMgXVA2hONhHdBBnT+kB4XGmfsiFZ3O9fG11YkP7cN5EmZbYgFN1UHMqHu4yLK84X0h/gsS5hr2mrTTpylloBsTH53LockJHeh2EMj3ZFmFmCmdyBx+y+X42EYiKbu6bdB2gcOq/ds+AjEY8Se+G0YmBEvi8GGzK3BcXbnSmnES4m6KDccendGaq228WuDj2/xGy71WP+4tm7Iow3cksHQt1mFidziy7Ax5994EPVH+bN1fv6DLdoP+8Gw0GHhdPDmBLYFxasFS95ZBlM+EsDLLfDux6sYS+BJy8hs6Fpxp88Q9n2iqz1v8vJfd9NPuLRpefUE/ogdWp2Yh1/N5eGb6MbXaallLS3UCfBs++zrr3qInJ9ph+UTililPRpoLMtK82oa3lmEMxNS9MjodH1/ojiuHmNsaxKs6BB7P37I5/BbtaVtTIHpoK2BXSRAXj1a51Z0Z3rJD+u3IHo6lIVH3VlwAu83n3Xsh+ykulHMK33ZbdqlhfMAYf0K3LK65s6h9y1apDH0kZ3Y8k1tbTB9NgOiqb0pwQa14Xo9LV2+RPMDavcoSvDAll0m0sH16TXuAawSE33JClx18d9M9cCFDamTOXGrrp5RjKP+orQ611cd913DkBH426CFKXN3/NczO2zCDVXhJztqMG1f3uyPHNlONmIzecS2FH+wlqu5PyFooBK5H223FLCTuFCtt0PIdzPWx0WAqc/AFap7ca7akK8F1XpMTcfeeWdtp9R7aE5tkGqwFtZAdH88GY3mOJU0c9+hLzIxMCCFD22XGqFSrK3uW5HaEdCG9hmK1AJg7fqj8eUaEf413TTN83Ob+01/LT3/tqicBzHXuMBtYV65/HXdhwN7nxXsYHv/XMfqcd56cYeSQRGSD6z+rpmh5vA66iRvZAZSCJLzGvKCjrDmwjGGEW8slq4vOAon1srevSipLsKi3ZG1SYqvDtDAhzebRHnJJs4+mFwB7oAk+g8UWXRGebJBOuLtUTcBit3PTg5sA2vT2qBr0SdU7XTIsJQOzeY3rm2mAcNrsHF8H7eANuIOxw93yocjZu/AGbv/VxE7txJuAB6G3FTgoBzM2psuRGuLv3pPNz3EXG/W3o2ubIwhScoMZIS6/jwpMbtX9ZiM2BRi2HWgfLjQeB6CCcHswcUaDgHdB7UIGt6DV4dRHYEV9/L2b+gTZoD6X/wDqNxppo34b0D5ciPoHoOJQv9lIG/XboXYhsxU5aIGwjh1gp0DpVkSJpdV3rcJBR+VLo0QKQptux++C1wBkiJBbFozIWkTlY4dDEwkGW+oibt34cH7QQQCJkS6E0fv3FkIAwgoW2UnMsaDKx86rCJS3XHbtTnrQYYsrVr4VP8XhkANWYWinrj5q0Em9B190WpLXvo9G5rxyivE3ZZW38f1PJgc/oS6V83Mth6uDsUhjuxB+q1L4++d6HpYbmRBRIqvCoTkwGaerwie7uUoo8O5bRrQV7sEKkt1JvCmiNTXipM5XseqlnZxksOVzy5dRhXqaC1fGyyRyUvBErFdS3DG3Kzex0xV5eNbSJ53T3jmd39pLndveXZ29o986v4UAOk+eorRntpLJ5DK9bLqs5+EG50tKt51pJryIylhOA74HEMt3ibrXnwp5SCbUqR5e2cZbjfhygDz4gZRz+ZP9k0/VJ8V/CMo8TaYqiaZRQItC9xNOo9nZl35yn4iOfNCHkv1tAwH7MC/45JNtMM/LSsyrRbqxbmgGZ/3PzlXsCDq1wo11L5r+fQUC4uz09F/PKYqEuqQZ/Onc+imDUWA8PYWribDXL2EaA56rpIe/gMpFMhOdcl1W8aK3SuCnlew9X6JRiXrTebXI/56gLekivsnjzvevW1I4Mgcmvcmr3CnoS8RiHHU8V64wzEa5A0UMOURJDH4hoQFzdkiVtdEGii3Yh9X3gyrQUqOmeARMD+NAbKYGHcUf343ejvPpGjSFAsNlnJ7b45ZkcyBctZ0XG5lyes7lZY7ipAoYnPntbPmwjcbjQpn2q6RK45G/oWGfxpOcN3wBXnsssK3ONK9gg7idn4n5H8T8j2L+JzH/TMz/bUMUISZQrVnXgjVu0cbFqN6QghvTjf7sZmNXMqZjy+0kn8bidjzFhVOU0WK52c90izzLmenwF0UzF52LL7+Fj967+GaFb7V2vo2zNIc/eRZN4O9LuiAYlcBL3yRj6VWOuTmy18t8Bct50XkT38OnrvVwJsMi/0wms+vbx2RmkM7ixbaEtNQauP91+q/bcjXGHa+V+u+f/avDZqfn6sGooIhTugZ+jjI4ASHei4Bts2AMchGLYG0g9qoqXwS9/h8+wzahbuA/+MSvCs9bmdvwoDqrjARs5dwJPqC4BKGrfmzZMUQk2XJViXxZkVoqw/4IrBhmTeQwiMOejbFyclto7+QzJVEitvB629w8ZxeeHrILrgMq2e2snt1LWGMQ7FR1k/vFBDPv0qAl1iGEns4Yi4EzRn5LFobvqVpzYOAWCWRtlFhCB8OowEBiAVd4bgKGNqWUnZlgxFHGMaCFg07i0QS4kYFdA3RAkJkwS6WXAa+XpKBw6WWR3wDG5WYXtwWBwjbJMqJykknPIWHyoFE3T0lLwkJ2H/o6mY/aeo+0hx1LOj2X2PdkWJLeH0CYmma4Cku2tVXGVNFlyOdptUzzaKpw201/ZDktL8vVArhmvZnSm/frAEOZ9hJYVbfjNJ/c/ucqr2IxnYppKsiOF4uGBBfzQixRpurVZUv9LNEI3uTINL6Js+nGJCzibCXyVKxQm4DWWYXBHrYxNGwQ0vzGKq7nKgwxTis1yFtmTtvJS89rJ3WjokqcnTuqEm8/+qhn9v8EsvBf/mMS/TGa+dthkad6eghJbw56G0jvkm2gfEJUhopbHK2mSS4mEfBqKeLFOJ6KhIJqiWRxI9gqKsq7G4FnfrkeFxqNurhcJNNpGm+xIEObC2skXBz+nANwnI3kbAX6Vl2ZFq6yKkl79EzoyPd1m8Rk1/550R3G+gmZLgmR4PqoY53kdu6ebKbzbed959vXl51vkkmclTF87Tj0xTu1/X4/5uvF+I6jcYBij0z7CT68RKSdbvV1EbrcZ132y8JnGZ3v6DuICGHOObb1SKH26ULmRmiQxmiOXWjD6KARmXTbUKcQww0bmQN9+QSdeDms0KlQzJptR9KHB+rOlP6Nt5PpZtRhdahiVrBQiv1Q+c7FvkR90kFUukWnIn0UFoZhZJrVrUSmFRXi1FzJL7eNa7AA/DJfLIFNcI9fScNTom/Pvqu6SdfEqesrQ7xI7NNECgnXpYfg4m4pMuGUkRjhqWMeTrQHUASjjAEc8Uqswh96NTGXdQdKRryjSTBTNak+fhPPrNQtnhoIdVEXT/u66ohT3Qv3+2jbVzEoabv2ml607+nfMwwcTOw4oRtJ6mDBvWg6wVukwcbrmwh+8KXnrhdMcHbkFJcRI4fDRHWBa5eruGIPp7y3dakHE5F8QY/O/IEUxkwO8t0DBqMkIgWnIB1E3j1FD01AIh1hKIsujM0EYwQkY7zyvOZNrLn/rAw6gGVZsA9fsNHKnheNQSVeoRehwnT54AkpnPhD8Z13qnAKvB7loDveLIWl3GNh5YlJmiwDDx2WuqeiI/8Hu/H7Oaxb9OwuxlnF2ISeYPWPuRvq3goPTzd7bViWaGSbaByZPgpJ/mrD8tRGUXsJMo5cysWL7iVuOYIhLRWv7mJtIWslqYTrxQTYo4uHwC9ushfwjUTsYa0AYdFWgAccUSG8Hxta1blgY4HrLmPDoIC1wsiRQxClf9cgdLKkjByUPXzGo9UygNjKDE8+nUxOwTzNja0sihBqd+JA6ESEKKGh2zr7UBLhn2So133T9eiHJ4ZD/Uv+GI10Yu8Bk1OYgmifpFBXmCsz15hZkUc674e8EZeVdz8VXJKRSsmpVD5mTx0nm+6IjlSN/Ie+uV39g9Jke+YXpTKi8u+I4iioYzwV+u8Htpuz3zjuhh8ZS4ZBchtoTyUSX6lkxcsWnGFiGRAQyM6/iO6/Ia7y+1FkOaYYVEA/PCHPfPeWwZcG+N0BLGi+qPUJWpWGdirgYJe5wPFyC17IgaXSPT3MdYBHO2MKvMqmbhOviDW4AckmbuZBlb8DiSerfYdvUECFBf3VSbqz8OH0VH2rQm43de6haFgd5C9dr9U7mfNonRTdbA+3Ur5EONgwtOdMP5JABIXN12EwzUDwfNMw/GmyaZbpXPoymXIlkJks/nEiTFLY8e3pAeXrHjB0swcMxT1wYVQPGEKiKEE0ipypuidzTfc4m67J61z6MpmyezLTdE+uvN/QXaWbhGcaySn5zQJy8WCSelK8yi9LyC3WFhTLWfnhittFacE1he0ibmZrYbuoam1wamGl2hiNrXRb8i7SeoceF7/4RAyfHOxmBzSXsJ6EWoI5bPBwRNRxA40L5qnLPnVQmc6wOEwm3GsjXg65LprPWG4cKo2THQcyQU26qQWqTaqOVo0NC/urx0engJvaNlv5dgvk6HK9tXxTqq6n0Uc3CREjoUwZxZstmp/Gi3bsuzCaw6/fUEvfhZPF76rGPSNITQWbWtusklGtDQgn3QA2QaS8weCZJou+rerr+XYygpG51gbgBKuGBoSTruvoTSLycW/UpTMs0DhNW+Aw1QLiZbkJxul1QBUdtR1c5ppCszxHjXtHISfXFJrH0XR3ISfXFMLFbkcJk+WAtwKq1eWew7c7Q64SEQQXVDuXvq3hrOfbybwNIGlR2jA6DQG0HdKGMIkIIiWBlW/mTEQuS+9QR8SFwvqk1YK/UZzyrx5ZWllfISMilKE4sqRp8w+PN+fCk/FoCVjuDwFcpmKBOV1Vs6Bga/8XDag/eN1Cl1WW6yqZiySZVUR9cBEQ/1xEJ1MR3rgCuEQUQO8N3qrWHxWU+q3rvJd1/mjBRw8GXv7WaN9LtC14ig8MsDTxfTs6uEzkL6rCDhAs3E9a7nZlyWYoIrms9atC6p8mLLGwP6i+tmRZ14uoTEpVGX1QbWP5i4vwF5Wh6fJNtM5X+xRFnlRq981fKRXSe28jKOSGtQ4mt62k1bGAu0im8T7djqFIzYDq1GcJpaA6TKXpJ5OletEElBnUsHYZ4BO0fYqEc9bGKkItydrpC12ijDFUb7WjhM61sLmQ52CEjIzgV6obw7s1C1W7PEbzxMa5TyuTYUcenIrWHNjzn0p1oFYV6ym7qkt2Vgc5f5ZnA2WnXudmKxrtWE4ntWb8zq6sNV7BrldFeD2C9P8t1Nb7UPtvpZqjFDrMh4rhVujT1O9Ah+dtSS2JZEmufjZyWaIoPzVdnowfUNLyduuxScN0XFcFjLwdSRZzwT0L5qd4xMYf4xT3YRWu2yp8bAvCTljYL/4l9+b65yOta8hmw/vbRTc9Wsdv43smJLv0HdKohmwjH/v/HVzNRxGNHNsIe/zBaoj+9Vir7IToOZ/r9s7Iag+kigZtJYtu58CKPoowxnmhLvrdLaUS+Hb7zflB5vsml1vJkv2sFMkb9RSnlKJU4J3VhwGT1IbSIAcLXxvNUJSZHv8Uk8KgvnuT5QogduffNPLNe5cf70Krv/84/aCydEjjuxjKbbRB0Vbh1eOxbfYD6eKuQ4JY9x3L8Nklxofw+LqI55+UfvtzfrVgA0AV88CVDGfLIQZLEWGIQfiLR3oaCK+04CNg16MgwmCC56AFMdZxUEp8ovDbHGDU/aZ+vx/pI+w8fKbPWX2xMR2OuF0OJpXLO0cphV/QEa3ev4eyIzs0VqpHNxcJhtl0wsyOts7VG/M0L61i0kkBBI58vBdmWr6azJ9PjO3+8bmGJXqRjNIjp9syymgidNREwIS1k5BkUAyf5fD4MVL5gKNZsqkOa52mKuxvXYPvnfPMYlSU7m0jZuvelK4O1GpQ+jiN02U/nHnqFECtw+kx/xW1eiu3Smk9/bBapTVzb8XK8vphNctzoP1Vrw+udi2rXT9WJdktPqzO1fKxSqcYpeZDq51yaJvdFVvcekjVNnNbH3taWMDcXK74fKuFL51skpSrEnRScvDbd2BKAJrZsYy8WG/zuoRCF58mFKVaUBHZ12pAkTSvKRg5BWtA+tBOOm3txpsBFN4S3CAss9dWnrb2WvkPVr5lezUQVj4fQ2z55j1sQy+yaHmJ71MeJgW5UK+EUjLU00ZpACaDn5jDqw/IFkX+kCwwbJNSDAhGDVWjQnu8MLEmlprwyI0ttTx0rMspbbj5po31R7ax/oA25GnQxzRDIS8Pbwnm0BTfwKZe7R8cA6pLm/EKPmBoXYZ6Tg58e6YrV8VHdE6PyfXPCzxzUkfJfFDXCqnO6yhRegTtAJW5GprSWzlRlTAKm+ncBTpqP9I36QlTq7Uku5V2kzFo3EfrcgewzLRw+FafENrfchdF5em4UP22Tw1V2kMDQK26bqJ1cKcy1s2ifLDoptXcOWRe2SzcPG1U+fFOYH32qHKrdqQcmKIJ09K9cRPKPqVUOekOAh6y98VCb6WvlR5EmWCP4tJqQ/kJOuRcPjQhauOoUps9Xa5bCjsjqRJbh3JZthTfOZbLeDd0fTCX1Q7EHKCiBailk+MWsJbxXKa7KDkiAxYezVyg4/bbx323+BgnY1PzxjNO3z3lTuXhiRHl67OgfFXtL6AA5OGzRIcW7m+6npNAPIQp5Mjk5LideU1XEOzilKLL8x0FpxYGoGos1/vdxDBASsxaxcxCb4FJlcoGM/oUH0TSYYb8qTx95G/9k1AcF3F0+4Ju+e0z7CNUjy8Dao3OTrQ3VS4w7k7boCm9Cc4aZR1YqpTNmoETb+Jd1XNmo+COIu3AantWA9ZeLg6w3nLVoI3XiwOuj57r8OrsmY47MOs1zYVHB4inTG2A1DyrD5ACdgfIQNcGyAavkdAtU6e6U7De5VrRRsef4z3UR/tNt1Vr3eY4s41eS1C30xq21mcJbPOkBnVY0qq1Rhun6jppuFh7gVZQlxsVaI0ZGbTGiwq2zooMXB8WBW2PBx7dPwdivjQCppbEJ+vwjfWVyu3OBtD+gJj4JfrN7B5aBOtJpwP0VXCKecpVwUChq2UdynLiMIBTvJvSAOVUF7LYCY0B+dtKoENlewlGRRWyCfoOH6m1qInfhpQFf7m5mo6X8WKJ5tXaoNSSqTZC0h6YOlCjUhsxO81UZyPnQOiT9S9UYNG9DpXxgxxkPmnX0Ug9M9AKSD/YswNY5+tCzBhNYIs5FNzeyqWLj64fxxCBfiyi5WO9o8sIqlL+8OiPbh2/Gs1bkM1+ySsONViZym70aAx+Ka/t77lfgGDKr8/aHzrp7t7QLaK3qfUSZovqFpB71Tq42qe6wOO4uo/Jz6dZP16q0ADNohFdJN1dUua3IHgX8/WQHQVlfguy8kppW1Gd10bBIq4m83YacpYZ0ddVvCgfHU90kyrrQ0OJLQPDwM6wKFB3UBiwziMKtsEhDN4kiirQQhKFd40gBnOLHGSDeJzBFZWNyYHNGobIlr2hOQ/qwFYvGzOgDsuuS8an2p0ArdDau7rJ/3X4Jv83Ob+9jMX5TZ5vL2LxfBu31ws5Q9vC541GGgP7GJ/XOJwrVHxSI7zD4C2Qiuh1/nZBrZFvcrYL6nS/wdMurNN1DJaSzNaPc7UEtLhapbTytcrU9GpC12imACTVdsAryulsTbtmAYt+KtPi7iZ8k78VjOHvXaUsDtcd0Ry+q5DF44ZeetRaSrWM3GNsq2qpsa+T7Ihot0BtNOpi2gVuDkYLK9cRavS3lU9vQOtB5RBvWaI+SH/pD1vBbuhgQtsbvpIZlE6GNVDWOJGcbul65IdfFOBhk45sSUjP/516A+90Sf5rG3pHx77rPsIoh26CseJzZUYNI4cOxxIaXE+idCIDO1sHDm5JH184sI2ebjH6fdbp7SnvX2PYO9m99T+ze+v27pEp/SAs1zaW9dsye+ljlbze1jzrCAKDTe8xDPPRmFvVP9T/Mz5hcIn/DzHMmbqygfEY2HX6w5maS/8TuLrhIinvl+vTadVSjSckNLG8KtM+sPUKiCVkceT81tJNzmpWIyeAzFj/t5Fi3U4KHfnq0K7UZom+SIWz5CCS7pssFnt5/CxnwI/I9tQdBX49BF+rydbeSM2detW/H+l4ZtWH9ffjWmfekR1+zwosy1OQvMNQsoPr4UKIJe0eTqNyHn9cXVzUqYwipX1cZVTUrWw1TuOPrGyl7l7JyvA04qOqsi+zYU0UYW+/X18Rv01XsLKURjByWZQEeg58J9+78geb4UGiYBQ8j7sqlpzA98viAgMQ2MHD8CGzIsGLGIHDcOpxrS0+Sntocxu36uCnboJhPfR07nY3MqAL4NPv9zPsbeZ3H2J0SLTIRZFS5FyXaKrZrcgqqbGHsPU1RnUpqCheycF9aiNLUDlyKm6MkbZgXMTp7FEDBuyfZiZ2hU6ybfoWYM3QISHrdg4CdcwcEtC1chBY3cghIRs2Dtl8zV6hEajvah/pu9Nr3ibWe+3214Gp7eDs7jbhtFuI21sH0PYHqfXTgdP9VIDNnbGENBtja8/0CFH0Xswmjp1ok8cBbmyvGozhgNc2VzXmcECbW6smyWqoNDZWbUyirxTvJocCUaQwt5A1ETSIviTZuEHtgGG8GgeIEhwQE9qleevZAWQnAQdOJjlgD3okTZLX1oV1E3DdCvhgeuvW2dbjdRvwegfwgyKQW2+TSOsm4LoV8MGip1tpK03XreDrXeAPZhDcytsGYt0GvLaAFVvy9wt8HSzJi0cYVLqK2EMnk8aygvoYymwZvGp3IQVQK6ec1NoLaUcKK3u9D7smj+lS+zHkAW/Hcb0PSyrYhufDXjwfduD58BieD7vxfNiL50OL298BXFHjiD3coJz8Frn0CG3CyjzCAP2Sv3tcbFbFCt/ei9uEofD4mVWZjkI/hTlL9389CuDFm33rhM2eQhoY3bV3VUQe3pj5YdBKoNQhWabQoynr5TzO9tkcJYQaVVXAcJsCWETZiozJGkSm2EByBDWI8T4iSilb3i5kDJBlu67TWNutHWh14rlzRCzoZRE3QTGxCddTmkoDuKdt+LUS7ZjonFoJdqug32WzlJOrOfqRc2ViB4WF9WHOlSnR0MyGsShGyeMoRUeyOphK1nDQv4rdnm0wmcocAJudF9ifR712zNjraaSxoxyYeFAZ087lCa4Ac8u28ibb9nThBc6p0uQYuNs4XjYAMZHhzBX0d9E0WZGDhP0tb7diMNEph05jUxpnsmlcZvdKC4AUUvmvBNZWI9A/3RwO2SZriRu1IHxbHVa6U0Nl1YCGLjLc1SvADDYItlVR1KpwIOvmr93VjK1q2oDrNdmYOhWlh3SptRJ3hB4ZIqfNcu9IuGNmg+4bmrisAe5uvtrXZxdy72i5A1I8MiIudNqErlEXfU6tmJx69pjQIjIUlXuN2LEE8k1iJ4mHTSY9HFzYMlG3Wr1lHERKXx9cqzEWtxt+Rw625cH12s7jLQjGH1oR8lOzmuoj+mmXP3zodlF6fHANNbKaKtKPYQG+mrDHnD7aKu59zMSsxpYMxfsMyDJDWoH3mocVKNt49xp/NehKbhl3m3ZljtkM10Ct7bDMUVuDnTZe642ZD7bxcllp4+UPY+P9CNOtzDSm2x0G2QPtsVbX9thjRWHiw/Ap3qGdGTpsqap15gsnjj6go1Zd1NvWCpkOwki7j0K7omebHKzlHP1wtE1dLtZOhb/38JXex/CiI6k/mDFbStdGJ/5HsIrVwxsfgZMpW8Oo+iiMLHb5aL4wOBQfhYM9CT4Aiz1zZ/xReDhs/QGItEwHs7h9FCa27Pl4KfNPnpRqWVFnXN/UO2WpVLlOasWatVD90MxHLlQ3irS6okfJW3v4pkndmxpl6wXqhJUEdLvi7aNhHVmiY6MHRMubJh1vdtFQX5SrJcmaaFtQe9nHc7StPL+lgA7yQp23KlISxTe4dVBP0+G94rL5Qkisnwf5K9BDnAqvuBl3//DZZx31/6cce6bxgMWucHHCvuiP71kkeA2CMeGhoMvHpb7brzMxvox9K1FHOdEQd0m0H6DK3XwZECULrVGvDD6GMjsHXpSh5T3SKKiubJaWM4nyHwHWxQMtGq8txlbBDgaRjG6Th0U3UsFtbM+NVmIZDw6HXBSA9yeoZ9ux37JsoSd60tRpRaXztqIWHZsFJUZee4t2DCOrPt/Dk/uMvGkUHbqPcEBENnIqAiP/z6Oc6flHdv16Z9d3j4bNu7todG1oJDvcIJE7BSwKVbmE/2h67MLcoQg2mLkN7pmCEj9+B2WcP3yhX+Z6zNBp3vDq0RMyKmi2la4sjJxPvjYmc5LqrVZrIc5Xkbk/qrUawIEtukvJhYyY66a0i36KtdIq+dtEjuDgu7Tv1nU8r6poMl/s946HpUrHVLWaj3RZz34TBKDTfMLW6F3QDCChzYnpLnD78NRaoPFdmL1Y47GOHY7dUgHoIKgRk10WUfEPWsuYi/1uITuYe6OQE9HdKqSCAzVLcIAgt8c6HoDDICq1nUn03GtjlKGns8WG36H+Di8BzYCnK3QUHrns8i5extEjrFIQTK1TKtGTPyQNsvwRcAMgS/AXh+nZXX/voQa/fgR+XYPXVyJay+jbEKaAPH9qL8CZtcGUMU730pIjnbazsIyC2sbEslg7G+tyLYwsC7azsi7YeJ5glqTpAY5yBEbOcfTrp27l205urIBj1j6tG5+kvY0PaE0CUnvyd3uLnNnSJurNjZa1rd365DgqXI1QvywD9aauCWarxRjt8q5K6MsnC79M9k0xhnEcEjhlllR1LwQFesfcUwO8k65VOln6rdhQlGgBaV8GG8g4WnAqx+dUIeMcUCuLfWEo0xZsbgoH/OWnAoX65Qg1Xz8lBoWXVmAblm9OKBuOYVMLXtMS0IXD1bhxatoD1HBkmt0haTgWza4gNBx9phF2huPNtOE1tjPs0DIcU6YlmAyuI48FyKIDaBUQgT5URCodD4HdJ7SfngNkeelRuo6X4ECZcAmULP32GmAqXQNqt0MHzDgdshsIS2sHhFwNlQfAa37ZGCNC6y/5mJj86VkvID/+spEKjNdO2kbsdCtGDTlw2i6d7kOk9fuODC9D0DdAVRB6huI3TFsBZZaBNeHqm+3LgPWmdXrqeBcKKrMGv6cBO9+UKlfjVmhMt6GWzIItcJiz5Qsa/KgrCf8GZLWlVcA83X3I2oUP/Va84RwmIgs325F84DIp6S+sLcfHt3G3Gp6N/EEVDCtgoZa3xYNStL4QDnujMNObWOuxbC9w20n8QWJFo2UzYGmi1262gSpfe1jbC0p6iTJqA26+s43bta0b6tbQzLJvqF3HTZzFRTLpYahd+GTs+WukCH7BESofIze9i9utxGaRT5NZgqdYKizxMBNlk/RMcHxkNvEdGnJAykx41kvgHtSGdqANpsmnQSLBz4Kr1xByQvdHzky3IYxs6Q/KwC5Tbs9b22ohsdN6RKOQ10GcZ8m9IOdXQ9vG6l5WlLaND20YfaEoR+kGaTNu6p1GRlvoVxnVd7vdSo7jj/pBFfPFz4bkLE2t5NYtqlaB1EERDvmlG5G8dbECoQz4RKXxsLJifHsml6Kd5fd7YE2ufMcjqUBC/NYObGXzy6foQdXbWbc5waUheeSIm2qeeGp41TGwTFYvre6Ast9B1ZIlq96sFjgbD4m0Wo8RDRuKJItSKyp0mdLZee+3uMit5Izb6PFz5i0ZkpnbihQchdf3zouuJYEwtgSDaIOwRMc28Nr42OkuQm055hWLZqFCBwbu6PCxcqABpvQcUWkh6jjUaWxty1t7MW15Mz1Uv8SOlii2sdv7D2inRjbnc2+LID9Qr1RUOLjBxnjYFe1tMU+nHJbwH2/TrWpvq3jABCofMIE15h/csuGxZn17m6+i8SrF5xr/8ZadqvY2Ok2iG8JP8f9HktvMnpYa9/NzFU1ugQ//aQg0K9zdvnpf0TwRZi2WFJwyjuSe0s7h4JaOyoBF7QQqDYvC5FYVd3Iff58DFpWPO1Al9YmPVMmh/5HD1PYTVHaSt85QuWDrsalGdZ/pxkJFbcTsQ1KnPXVM6iTqDa05NtinKMBWrlCbLKrHMsJzumdg1B2ERwpoECkV4141L/LVzXxPGQeMF/PeIcgZHcLt82M8oe/4GirxRqjejj4IbzOLtbT52OAa8EevjVvnK8qvr45dyw1xk2nc8XYVs69c2+WUx9/ucubet1VOOxXuLGddPje599Hdel8pym8Z48t5MrnFwOdqprRk0awxdWobhtVMpWFb7ZA18yOW/l4x5nezmXx5vSWZmtY83MtVIiPQyHiscbMLIG2Z7iPtf2gXhHgC2jCo3zQo6tlXVoxVebwHZcHBerHIf+vl5UMT7ga2kfwqFC1Iq/EyeYjT3sHN4LWdffWbez10p3kOOsnHunVaFUgZb6VYl/i94yCwcrzgQ4S/VdC9q9+o1VkW6kKk3tl9EqTZi0Mu37chqm/gu6jqy/btZeo37tuoyo9Hwqb/UBlMwFL80u/9QtfUvY9S0WSifE4OQIGhJQ78sR8Jq/p9WORmKc+tZdxawXc4OL0AETD9Nt8fhfmmN0Yw62qTdRTFWYt8WrvgpkstQHFMlul6XzkN45QsJ4WMobarnIRwSpFaEO1tToE45aZRcbu/NQnhlEpRA91fTIE45djtY5pPb+J9ZW2wlvLjVZE9XpygnNLzqJCo7yttQbnjks+qx0tbUC6dk9ksLuJssrfjFpRTOn6YpKtSPiG0q7ABcnu92tskZrv9RJOtfq9oZz8NVHOEHh2cGjetFkmGB2p72deCIkG5SB4OmccA1pjIJq05g608awo3Sjhz1+SaydsoYc1ak2dN20YBe76aTDNhGwWsmWryrKnaKGDPUZNZm6SNUvXZWS+ppueOgnpemnx3YjbK1WakRW1nSjYp7s5Fi4bOZGzS0Z2FJt+Zho1i7vyzerdqb0bNPKs/ztRr9sedczW67yZ5nSOc6dZkCmueOeWW0Dtmv/a27PyWksxse4oqAHnt6OFiHk0xBkBXWYiLcEHe7zLH80UcDo3RuEC7Huv7vZIgROcU/vsvp/AffOzShdwPwrm+N7IOus4fczmuuRpLPShjl2N0wuNatV25iTEGqlP46FdLDbZt2Y/lMHfg9sGCwL1Wd8MA9LxlGRb4siW/chln+HuWF13ybu3ks07kH+V9UNKS6fv33bxPdYZ1cnFTvtfmCmt13zIHywQ8PGRrw8BCMih3dGQH+DezbkQ3i0xLsb0jyFzmkWqlBEWNUjmFMsih6q2kYmVcT218Wcetj1Ur4eKp+0a1ulFh47NXH15VuOd9zPQhwZQnjfwMvD8sHzocRo/OkZawE8CTNE/By600AbK1ijPIxUbCNE0mKsfYL+qwlt1CA2sjSQPYGEcMsLLENIHZAmMRR3tP2d+8bZC9EfrnRzlQcVFju3AS7IYsm0Ut5eAG5djvjbMq6z6UmRU3MDcrxPbu1uwW9rEnyrF9UVS14IzdI8JK4pioB4IzfWZYhrw6JLPufdzNYPZ6RVwu40klK3sHbRJiegMtD+c7IJELldmXF5o8JQBlpiyks4V32v/MrAN2FZ4/UGCDv8bdHVkiEtd4neXsT//eOfuPf+/84bM/dp52nmyirX/tBzuzUC6dx1ylvvZsLQ5JxhOz4ywZcmGRATdVlyiRhsHuFsxov6WsHHenrEsx4f3LbDZzC8tSpfgfsMoBS2PNjZsIFinNctSKqas1EKl9UhpOO62qB1Xqt+fJ9bGty9d72pGhZaNt52Rfm/VGubVrd0XcqzDt0pJaVCNHcbK1JFtASMZxgtsqkcYqiNe3OfiwEVLszn+3SrZ8nDGTuIOtmNaU33lSVefyutmSaWrf+2vMi9r51eNvmbOYteSJ7/dnSQq6crc7TPAx8+QIFCItxPaLYGXaLFiGbqRQjbdhoQTbNy4tKIiK3S91NuYk0qrFaEnhGxzdI+YHCGUQcIVCzwio4JuGzLJw0avnDolnVlGL42pi7BD7rt2areS1yMn29bHW5t4bnenqEJwIzEIFvwG3PrDLAtZD4AVQjDsgUzADBAcwO0gB6zybRommFf8Msqpme6YqfX67DfdldBJ0AGYG2MZPpyJO+uMjMTOVsTU8h2kSldUhtnAFauGm0jCCt/z5cXjpigirKUgMtYE9IIAvQGsJbSHnpDc9DvuLaNkF2XVtwVEIctAmpERG/8xa9kf0zfSGe6cPqw7onIGtnMt58rQruNa/Pw43UxWhNl/F7/Iqqg5BDU0wvYKgHbLbydfm4+Pw0wjtfxBhK5IM/YQPQFsCWghzCiDLPz4OUVkJUVGamg665qJA7Q2wTAOM1M+Pw0lXxFjFyyQ6BCWCs/HBBEQG/34kJlSFL28b6ZcsH31BXlYtHFFtNHVbNJpUI5ScK+VqyphEm1NNqmIHy11RD4iVxkQxCY60sTwQNXUeo5hQsMq2ILPscELR5BbbeXHYSucpeLXGWYtKLefg1U8XtPqgD9YbmTex8FoS64uS1S25bKqUD1k+re5afNHa6YOX1N+1u7W1WKW/PHxNNq0Zpm/r8GHr9O/Z2ZfOAq9Sv/qApdA0Zk3mts4eujz+nt39yl1XVfJfPmR91a3tWGhb8/evuL9nl/9y6FKtCrw+dMk2SCjZ3EaFx5fx37P3r631X6V9gB+Mbsh1gql1UWdey1//zZ10HGlU4sXh2o5pyiypbf08TAP6PXt64ahOOvVAFcrqJ6sJrZ18RK36Xbtn9DGV9OWH6GX1lkS7WmFpam1Lb0t2m+7WJthbctu1uYZ4aMnS06olr033qw+hpe01B+2fPqKi0Yq+1r2zLtYhW+qzvZTx3IruZb9VBrtHOJ0vHqGzsS56mSyS7OZLecZrjgZE4sJ9Ic/ircMDdHzX+UHGLs86oaesiPKGXmZOMelinQVZEQ49ddAMs0/Y2VPtJZDUfQabJOA5YuEdpxG7v7tJ0pmXfzUy2fO90flaPSvtCAxVrSyv4CZIm7mQ7hzsGAi3JTeP2osjjtm8E2hXi/dJmr6cRxnHPDNfVCt+9ibq2/kkkshoBx9zyU0WpduOluleJQPV81XVkrGEf9rS6dSTb7OpGAzCMnKppur7TNNWWw411pahzliN4FA5ciorypjgDArARPfQMCrJBithQzdxoGSKAySvSxoRZeJSbEVr7/l2qaq0smtT4RM+vFK7ZHvdisaHVatHRP5or1OOzmFVqqHkv+0VylE9sOvqsJ/+WhUqs6wMeKAGF+eT+W3qkt/6pztFIMmXoSRmeTGJOS7i8ynGadjj5cCw0iUtImj9WklLnv1iSVtRtT61F9VLEPz/XAcznF91Cx/Ppgt9hVqePh+dnctkEFer2Hv/nn6feSr/VOfPorTUAKdes4JPrUIoYuKw6JdLIEgXKOmTiRh0t0qlBZ4/PB3pM+y4n2STdDWNy67Xg+FL75NsOsH9/ODoLDg6svOd7C0MUueXWNzPxd1cxKV4k4ubSlwm4nUVvuVj+VXXP/8lDvG0I591Fkch3diYwUSZwpr35rsvXl29evMDXVKcrqQk/+LVi++/CoB0i36c3fXpE93+90EfneFrJWEW33e+jZaAj/4Zl/rnm1z/vKno50WFRzNdpCDgHV6sF+M87XpXV2++e/Pq6goXTjOYkwIHkwk8HIkqhCFQHlJJCOP1edHnc6bz5OSEIbOwGCYUE4DW+sA7Pj6qjo9jCQhpLkMsrvrzqOxm/vExFOydjfBY79dfoRgM4VHlCyzt5BB7PcxlMT/uL1flHH6dx8A1Hci71XnSYQISbuIKQSBXYfJ5ePr+PRTOl10fai41VsDQ8qeGfXbKY/8wF7dzsbgSL3J7vB808bsw3TfAg1sP48MM4deIfhFfejifbw0sH27gISh2R518+sy/3WEhYjznHMaiGPk+tMoDCB0ZfuJ9IrxPoM5rb+SM2FKN2DAehRdz+DBMDyP3KprMoeZK0Alq1S/iRX4Xv5wn6bSbQBtFP8uB7ZmioK7FEhVRETxCbHVbVL3NHdkqTQ1/oAedrM/HCBF9nBLIEpN8MU6yqMJjwTiMzbGuyLCVv+cwUNYM/PtqscTDZjpD5DbUQJs6l2W8mubAGjdXGKoDWCcRkjGAjonAYkDEAHhpDRCi8gd2NnQvqOGfIf4J4z8YDEdM1VJERFdgpSqM3r+vVCsYDcRXjANDVo0MoZ4ToeQ4FH1SXPsUS6f8ManmIJ9AQL1//2U+lJnI6Sw7TSU3V1YlVOPxMZCqsEkFZFzQRXbflIPuAiNZzSPJjgzJ3r+nylDyQXWxXR1f42XamwqpUVWdhfNg8GXev7qSa+jVFU2YL3NRlfZU+TIPN9DfaEb7mKFBWZiBHgmAUHue/UAxDFe8F2SycvNVYq+Ib2g7Uc+bJUWJgZmqxzCUgOQNuAcMtr+LRVT04qLIi2ZzC+lcvKeGJcVicgCsoWEQ+3LYnqrKOI3l9mofVCp9EevIlkt83gt2aTs6AzwNglYGWGwSNqVnRQEBcomvqgYa9W5N6S2jYSP9rrcrB3DbkfUoyz3OTIeyxmGccT+PqTn8jW+p0Q9YuOiXNZF2k8jRvKYg+gXtG/AeeiwmUTZNpnRIuWUxDZv5QV8pNC/JBaaP8SeTh8HA8wSs3CTuTYTf7qkoq75ExO/6/aisLtbZpBvhYrKIKu30jMF3BB5+RH3p9/KWK14VIG1zP8gxRFQZmur6RZ5X3Q3J12BopSsOacubpFFZvokWGJoXhU5wGZP7yYj+p2T3hhDZgvzOfJbY91dd+OuLqH8fpbdv4hJDLXXz8FkO6NLcIUGMQpwlPqiLculCrCO1iJZGDF45qx81fV4gOe+6qMrIX1raWoveuV+EKl+WwwKtkHJ1KWDhhTIZjGzXrOgGmfGVs8KUeVF1u7AIgdSN9RpZRTegVVVmHUZieoPeWRDX0mwoLDXYDyJXEkxqX9vcNjR4vAO8BcmzoOhjlLgHWKF66mdNH/k+55WObQ6gXRY02ugssnEVENmDhNuHpFh5yEK5UwEqIKgasP2Q+lHXWv2KEhsx86yy5lkiMIgc3X1gvbOqT7cBcDdIcxxcmHKBd56F2WAALSSi9FkVld64O6deQUosM/JL7Ais1DMMJ98vovvy+HgmiaqXcdSsu5wr+wuTBqp/OTfV29m+DxMKZkqMuiLUDGSdCdClIamhwndIZWJh4brqxP4ABNIuQm39IMZuYDQurEJVF/WrXO5QmBCpLTFgZmBsYjX3vaefXl2VyWKZxldXnz5Fm8zkg8DPdat1YgJqko4wIzOJHSE0DWd9viUglmFeExbYpalUoTWtznwcG1fKLFXbW6xzHoIwmfnn0z56dxbVC1qIunOoV6S+UMnPcQGD1LmsG3ZEYmKurNyhwrr02yq561PYa9hanM80TwtqNmU6j8OpnFQp4sFdwN3zJO6OhWoRLbggavYI6/kWti8sOEVqmpqYmaSE8FuSAop31UT8LUcOtqk1k9U5PAnbnBlxpGEXM0Xvr2w5ALJZy0W7XZIKTrsVy9oNyyeYzcw3iRlkqzXEJ25WiGJG8c1vuc04WdhaEawuFeyAsml3Ej6baHx4q3pU2jVEuMvKsRpeBmjpALzz9qUj4u7kPpTJVRmeU/k5bPEIbcnLDoepPLFnnCPSFAhlxVow8iIxQx7p/SZBqXRgi+PjtG0viMkWl9D2l/YQZQWySvyWix+cTXdZhUsQnBXW+XKOv99mxOEFZH4FP88r2Eyf/4bd/i0PvWARF3h701KZktLmFJCJf8l3iFy1PDAHMu/ISZKDNlKGz8rW/S2IXgkYDk3lksBaMqH6J6S2kyiCok7jC+D0BMlx/WQTbztPNpXNhNdEn7/k4keHMn/JNWWIBnaXv7J3b3dXfR0+T/ZUT6NPH66MgnP29JTZLX4Wnp5LgokkZBMO9hogUImJs6lcyEeeNL9EoVyvv5t1vSGeGA0jEF1IqZ43gF00KAcm6amHm3f4wtpPcVfeO9vSft9qxWxRn3q02S/6ILwpwCy18pROrrh4LavnwYAj0tXnpz49CiBnJ2hNJO1OQWuCSak+kwEsXSdn/nkcVoDUEVu1YNdcMrY4wuskTqcUIdPfGjF0K8UQ2iytlRNtTq06ONWrFsJCi/WK7ChsfUhGYUXRNvv5kiJsucq2MsDFsatcY3BUi6tQ5GAKLfkKFVatX6ol+jwj2fZulQKVzYagdHS1HgxmpEVDCKr+jq4JAwV7AVSuoP0w0/JQ2U06tnWpnXyGQFq8m+kMuo5i7UxKtuNj9UvPz6gqoFuelYPRUjHnNl7PYLeOjxhL8tOo6gHAa6I12pYWYc8ji2i5XA5AANtCPEUxAwPXImZyTSSQ0yxoJqR+TYAOvvjbrJsKlKWorw6uj55sJtvrYALi3QxBaq8sOWHzRTxJS5bBoPvAxiDKUMmlUZAWMNy9ZULn4gkhjJganJF+dqiyTFo0OjBVNpZF1R6f+Jx3nCaWLOp5ckm9TLbnMqosbrlGIcj8QuBsQu5WutOzM5hboCCfQMZJqadn70z5eeM0L0OVA+nwKcui0bkv4859Gy3JHowWs24RQk/7CqkQOyjwykZV41wZWJdij2K4BY7qitdQpIlvtCXOdAQetFo4M2SohGAWPu32/W5v4P867PY/9X8dPb3pxw+x0ucznuACdqkih6lBdECW/DPwacSyUrdMmUd2ppWH+0SpP3Wv8f7UEN/YGV0LD4WiVDBgNw51fJ0TTdoopbCu+nzbAyXNJC+mMswpbkjL8OuukpJngqgf4UCWAm3dvElRA+mgfgR63F1crLtpaagpNxGsVyCjo+XbtB4tl+n6Leyc0jRO+WJJNwMg8S7pptILFpbLc6crCEQCB8X97j4SGUgPkyDfSeGKZwaFP+gP31ajwWADkyJ0quF8SQJUs0A/S/l2JqwTsES44hkG6gio1NUq+3AiZihcWMpNYKFax3S8tQJlzPNx55Rkq1juO+qSZ2ZLHlXjUszFeER316l396G+uO9v7ljkZ3E8jacvosntavn+fbclFTfBd5YsuwyfXTIUP0cRpRdK4lwaoeVvxa1p7lKL4nugzR3LsxcgFF9oQSzFcPeFrqMMrd/ECm+g6e4GKN0xth9dMygzb8hFnksEb7a8eb3biruwOx4Mpr4ikljj6FyEc1kZn9uCtuuiSf72vEEP6iLB7N05zPNaEaEMbgW+3I59RqK/CO/kfvBOarTP0xRqv0Q2BoHRfYEEkb8vKYAwGtOw+FruQTgluBQOBwUpBaIqbuhNN5xL7qb7AnhaccKleIF8cGGdK8kdwSPTaikuffHC7BlhVilOpInEB5sXMH4lrTQwgjWsL5pYA+XlTl9zdQvfAS9MgaZV3GnJrHOkJPUOxiRB8wLYW1a4A0y8ALxsHraW6jdWhnhXX7e/BAy+dAwHP0PKz1LAguQttqSt72AhyJSwW3zNy8cguJO4LEkTeOGf10j6Rsv0d8I7BknepLBBNnyBe7E7s910NL0Ql/tdmYI1om9QEgVSIlHU9s6rkPSEiUDjYlBjIbksSA6akAFSLIW80wnkSW4yPHVrl7A+uhSliHs8/ZL6WwZQST2NTuHQa2MCc2UNE8F0YnSeM71e6TO4Tr7VK7VWW/6Ws9oSbrZq3h/dxrwKulMJ5P5wWIxENQoaGVgL6g2xKPDZgQAUIF5RULfnRSfFc1jYxMayi3jCaNmObXPtS9iExWVl7706r5QXxZG92QmePtV3+WHnVRVruT3Dc+Hv333jnPaWE3T5Qy2BLK3zvKzoYztB30Dz5CSed5t2LaP20alrOGFFsmK19ui7OSyp6NwnKmU2VE3DKscmVMtADeBKm4e+0ewIcEd7XeuPqiNG1bwEDSbaaFgABvX2XVzC/ANpCloqd6Vq7cp3xgo0FHjgTacbCP/0f4MOBhvO3573fjnt/UfvanQCY/jrxQloZU+e+shmtMnSDizv3x/BiFUwvEcT3I43jJ+gQwB3b/SN6crYFpFOIkNm2tDEic3EKcYJ7L6LtXJaRDahCRd4K+Xd4wm50ws2csa/ttX0rUBlo7sZPkEdZhRshsCv2Xbrj0akb5vd/KUkR9zXZliUpI5uzPvYFgjJw/q29QiWU4T9VFcPu5xNfsQiXteU2yW2XTkivty5FWQ/ELBd3bFpLGGHKO2OqHhZenUGQ+EkXPeebDLgj/NqWErLAmjGaHxBVaaCPUQl1bTyBBXVBKdEKyGqRwlBgW1Mv7TqlYsUF9wH5BR/R+35o7XngNwAu5PC5i61hca72kE+dPOmGgxvYMRp+xRbtpu3ErZmRGhu+2kxaCYL1xoQxALGBJTSu/giXxWTOKhw5ZCsOei7mYMB+iZRL60t46c/O8cz8W7lashPLI9C6nHlw9IH24UyJmMpWpycLdYRmWBKHOckTNR+xDd28Qj7folOH7FU+aWirjyjSA0PIzENJ5bV3lapcVwnXHYcsnSQatAcvdWUs61vm+KHI7VUzbszsUnK7zJQtSgSQzBFPZUk01rcj0JYT+7QjwRE9EtQcWFNewnKcmy6cItdWPtja7++NIIBv9RYIOXuQSzcAucoL5lZaAVKeP+ePjUDc6/uwrn4XXEBNMbGl0q2afk/VVF3afgJiUvLvZgJk4w7sDrbaGcpRB5E4b0PeqVqBy3KuByPxR1aQwjhsa+2vjOflqPcbFLlAOstzFpPtrXFGIM18H6wZqP9vdRDb8OUpu+9Fvz3bBkGCiniXGzFK8TxFaopgwvupYTioA2XovEc5Av07rw1SsAlcPsLP4CNJG4FiDlDPMSeroDtu0AFXA/a2saW29p8hQ28IrtYhqGCqHtMq3s/WKNokB9iDQoNjMkQ3djuwnF3DmvluLukjcidD7PqbkSuWUSRNaCFQ3MbPtNua/iyDpHpllbZkd9gK/V5gZ+3PCKvbLfDS4a7hbXm8vj4kqTqBUqAyz5r+vAlXqGB6/zV8fGtSdzydlge1ePcuxUXOLHX1g5JtfIKW7ng5i/DfHg7Uo5wL5COL/z+LIWZzcwHm9oXlt1NOp1e/3/Xvm0dUbvZN8paoRKuO/SfJ5s3WxXBAMvqn/D7/J7HAEC/hzn9K+pPekOAXobXwyebV9vg2t/+et2BThDIpWwJ0qAKsnVvvwJVrsi6w+vLecw7aq4NyyVlJ1qMk5tVvoJf2bRD6lJcdmTcz7ij1ZL+NU1ucf161qnmUDBhn2mgJJXMcpS7VL/oSEQ7CdAfRHYL+t5xWv7n+NzzTeoIUwtOReSqvFMmKcan5AaxG0Du/rW9Pd3mkumW4bOl8iuc04ybo6bu+wTBYydyWwDBipkLdIHMw1v8GcNiA1yVhxcyQ3PgskOOJVD6CvbKCOlm5f6yfZldtiyzeoUttmIZvsYaW114ClCnlzX9qrO0jxteX+1z/6GtBE7s+qbKtaeTupSRJp6F6FDUVmRnK6yPbyzteMt+EHXTVeEeSGjvmtqZA52Awk/fV1udPCzg2+zKM8DFYCA0Xmwc0d4Fm0ifLKpzd+vcInfxTuT+BSh+lKARr3aefzrAOoMudiI07kLC3r+VpeOPo44iip1HEcW+owhV6xe2b/2RMbVjKMsSdnS4/XR3alW9QdkcklXlofCs6mcDW0vHKYypp6XJbmxZ7+Ka9Q5wSKAlgXt8i1ejUm7Dj86UZxqsK1kIHWzohRoxM81KeSRGRw8gal6ysgqyipaD0jdGJgJxFG0HboMqo1TTLGHQWgTXLShiiRs+EbLKgYpb0g7HMn7Tocimjmc0nWK4UV1VrM7fMBN1FnRXkzbxPdgMBnJtPW8F4opyQ7m0o03Dcj860brbbCumozA9J9+X+mbz+JhPKEDhrU/mqT2T59YUznxQqefmkI8kZAjadjXQZYIpmm6QGkv0pyg06jIp4YVvacw6iWGjr3PX6809eGkcR9NhOaild1fi5ZXIHbfk79BLICvNufl/5pDwdaVcCb5Ep4IXKD9eY9oPmPsN/vMCM75L8FeuvA0m+M+P+Hl3VTcbFuGzok/+odrvnfUwui9nuadJdzBpXDl/eRU+/d9otLjqjZ4CobEvl3Pxbm734nIebhyf0P8kiWEZVi7n/QkoAlX8lwjI6i2mn0FDqyWyDZ7ArapZ739ByjS5QZOUh34MBd6mrBmNPM+azW/ntY2dceFCCV5ZFqw/q8lt27FYALzJlZkhC/8T99Cw2cMQb+p1zs6bXNrWgK9KGsvXTuffzeXo2ARYWYK4Wzw7zfxet/gc/lAFX9gVOHRzunSawdbyNDuvnQnHfnGc0TWV6j1CJO9LvZQVx/9VvU+okSe7GvnGMrY5Vw/kbj0OYStdCfjzrBrA8tbi9/nEcXVS5+R4a1f9zMLqc/RhSIz0DE/Py8+z81Ld2EEHjck8Kl7CRH2OUqUXu98kzo6sw91Inwj3uI8/5eJbZzC+wMF4gv/8lIfE0Kg0wCqyIi8i4ElQ4pQpLNyoi3cBkJp8KOHvJAfhk8ECRala9cQPaUXmjDIu4O9WUI1kP1PPWLdVfOZU/Ae74j/Kyv5kNfCZqlhaONQB6IsE0IY6Ke/Otn7ry1dbnmhm0mzYuBc7NvZYaDtgvWdLeS5DviuYQF40gU25YTw6OdGRGmUAXiyqYzcaA+JwtN02bY4GOzQEYdUSbcsG6Vs4nlmVg8INTKWOhHE9P1XLeQtdaHqz740xrfr4Qtd9B0n2Cq8UdK9fRhnuHnB33eFe0oZmld1m+X3WkXV22Hh8vgN3RUZAXVM0+fzzF8nN6wwteECJ5rFFjGZivZ4kCn1z5guaL96JUkZa3Yg7oOYYVwMM4n4LiEEt1i28txpTA5fQccrAGJTwapPM9AP9s8YvIF2G1KxJE5X7PVJ0qJ0Akl+HoWxcq9miouMUUHJB5wJY7MvZYzsPJKJCK7pbmvjnTJO/jYEYt7Ps8893TUl/52Q9CTXa4iB22c3B2y1KEBjPruUAgwMKIrLiX77dC1cmDSXwqNeWKcuPWHG1mIbqtr73t2AB7mrHBnEv7Rnmcu7CVTqZ3VyTKa7OfQyOf8QsCj8y+uG6LpQh8qKeTyJTv0agv4KwisL/6pbvy95ZhrtvMxeOI5Fak+84oj0dNJq69U9Cbl65U0onF2Fesdb+PipsRJDVYTIDQyJqYq93k60+VlPY0Hioj4FJ75nUoDb91BCalEENolfLhxq05KXS+mtg5fSsdGzTWQ24USdpUIfp1SGCmD02exX/xZkapZNVCrPFkZllVykwti23ZeZYl1v1dU+67Zk1/KXk7RXIFsMSQUDJAY2Lbn/q+6hcVsFidvgMdL2sB3DmDFQDUz7obXg8NLJRENRCRvd/oZdQ4LkiZa2jWstSAm0XQYyvsGUyAP1eBS41z6knCjQL2QVPcw7on5lZCCq09GIJ2Jdjh5/XVnEkrEZPbQiVshqxqhoZHkEjdobu7rjHivTQs1dsH6M5tDny2QMs6Y6qujpEKaFO98gl8TOS2JFATdMdFOlRSmdm5nZVTmTI6/pMxgdjBlGUGkARLCwpYtQYYEU5QHvHUkiw3eSENVYyYgWMSPelgcF42ZDiH9UFvxb/oEpdjbz1aFOzCBtYKvsQaYCdCaoTS8t/MZd7xIKN9Gh7jbfmgoPSCwpbH4op4DKsY4rvXDeGxB9wnQnargA+GZ6NtoFMa55D4IG+tef75qp29xsUTYwIoFcM+J2Z6ACZ2muUYQETW3s34m3+6oT+nhTDk5NspO92U/7G809O9E1uFe7Sp/ZcyC2HBej1ks+bSqX3c74qOhsyTW87MHSgTo6jNMom8bTv+eet9fP5GWBXbmszGk+WGkWsm+wZSxR0uLRG8Vt2md3wNdMAB25Lfig47axRrNAxV4coAL7mlmLnylCiN3u9M/fKeqUJrb3uM/8c16veGR2IfxtV8/4iyejOGQg9dc0nEaf2GXLnS/vWesMHpiArOkYxiMNnR/W7X8fH6FYT+yD30gL++sGXeNPePs5+4xxnd0/FL9bdCykmgY3M9Z0YiA5sKxLH6Qrf8cmYQur+2hbk0tbffbOh84Ldb5zbO2jRjPX1Gy+APQj5zZgbKRZlCPVQxegp3+TZd9kXIHCyKUXFx+Nvay9Epk3sh2uFHWQ6ckBhzKZ+ULRZh41VrcQ1U4ccsArW7KOZ2ty/wbuvL67QO90sSMAJcX8H/nR4VnsIKVGXifRcoGVtuLOS9+8TqzmRjALLcDezzePEZzY3WQsZHc8nsICHQPPYPEKCvvurrJwns6p7AxMmIyEHpIEJiabdmB1EaL8AonwIa6hU3ke+M5RpudOE+GeMyWC7Xx3bURDeJVTQcrZ++mt28vQG3aytpHJzJraY2vF8KSpkwBqSoMpIvmFDWa15uQRrJ8ASTYToonJOTk1El6d/7v568anf7fRP3g+7m1H/U3+gXMv19ezuBt1TVfkYdMcKmam7wdMGlPagdC7KIBtIFPE6+BYJZVwv9JKF1/XcHV5CW0ETH0LKOam+fJNg7Hlh3KahPWm9CDL2MyEQQG5jDgi6SzHX47IcgHh4Y11XLQRmB9Ztkby71OCrolsoH6KlPdZupew/c1MF89qV9R3+SCfLYGkqm3TJ1ZoEOHsz3FZosF6HUXfoUbg9WqfvRtCmIt6i6t5hIKLuWoz5QHoGc2MabtDdYlLCjoEcbdCjMxd4uV29/hPJAH4T5z2PZX1RL/pWNspo69Mw8tIPEEcrzxPLkYBZbxRQNOSB3AIN8UUEw780fsXSv3yG9aiup925AEJA5zO9p0ZrGy2trY5Qd3RY1cjCGXsnhiPUvlrdo+585XdCpxdrZYuh1raAGr4yYkWl4yFnv47N8NpE+HqyWW6vR8F8qxXlO7GWHRv7ynk+BWygY7t6cb+7F/f7enHv9sIQTaHnaU9AnbIF9GTnXmoDJndvHrqOtpst+iI6/lpHZzWP4aNT0XQohHXLZai5j2Ea534LkZYOkQCkpP3EfWunfxdiGTuuIZeVpu1nc4t0OmzaP5lyp/+/opxt2t3tcarpVosmqv2jJAlxewKSbnMImbTBpSRug2LzLa+Id2ErfloRWXcSENpMuQvrmknNte4Fy+PhG/FOfDkK46g7Z6cncQnymi9bvamHppP3kuYt7lHf45r5PRR452MUqxe+9qD5Psti9NiHjSNt5OZJVpFvyztypsno93rbe7K5hIT+tbiGXUgHBqpTRrM4XXf42A3dYqrcAjae/ide4KE+QcVHMr6Zg/Gk6L6p3aH6OaQLLorO5n7LXFu4yvfvZS+uVVJvVcbTHrrn5KuqJzmgB7TvIVrXYshbqCURubNYlaBlQivXZjg7GNSP+p2AeJU1kNsOBxXXGJV99B/+EvjqKrynU8f2m3bnqltqY3Q1uO2+ET/7wS12Wm22XuR5GkcZq1LfkzP03zJYYC/9EQ6evxU4z9bAquI2XA7XIzndhvdiPvL11QaaIXf7Z8PF6PdaCF7paWZk+z8yz84Om2e2BP1/E+3/TbT//om2Y73+nWcaoKVOnYwWP7dsMHPu5R3vzKSZ7u6o7gfVXWNJ+aYcXcu7b7kaqO8aBhfW7cJXdGUwuJSX/2A+hWvxJrzr1jSSg+sD7VdZDv6a979FYSI7eXyskKs3ya5Ksn9v7Ct9R7AzhsFvHM8Sd06ALfOFPovFKbXEuQgD1IFpl2T0aHKHm+lwnX3YzN/GwKQFzsRPCDCqemjh6OSFupAJyVDdMdRlRbTr64Pemh3qjT94o9jzXfhM9uOd5a9GwwhZsF0HuRK8OT5u6yzkvvHxShnN9RS3J//jeg443qFp69urLl6tG6MhjK9rzpHpaxfrOAc2mbyqONyudm3jQT+ZDgYnJzPYuC35sjnM4b2iQmmzF+IVarO1RxuhRo7Kjr76vn9hv9B4fDztW/NuPSDSPdlcbK8D+tmj36LLvHppsTn5wMPUFfcDE07gcqDFrAOqQ2dzQTrsHcu4A69EMgXZQ+tNbY6ore/rbJYHcdrHba9cMW9NJ5Ks1sdzp1NLhf2FhRI52F8MtG3xMkHrKDuRzrtOxmAs61bx9QOVPRi0XLwdXARoY7apctFKlVcOVV5pqhxMjS/WWbRIJngEoPhxatlCHCNaqi9DFqny2GJTni+KVDp5WeaiuRu1TSTK8ufateV9yKx+tpxH8qpghvEHSmx8PoA/oB3pBZ5TcYUPOOccIcs4KibzQWSBcRIBRtL7ckzx6ThCxzSe5NP4+3evtZaGj69vSFS8nr3J8S3TNR2VwDBUySL+tjw/yt+/73aPYhmS+P37/FksoxH7HOP4VE3lTOS+MrBSjF5Dpd/mxmT9vGJLMJpKh/TMKMz45C7mIOLsyDAy5p6YfIqxrd/mfK7FJxDkO0uBuoyV27GN/uac8ZjLoHSTn72LG5bqA/CpND7S29kjXcCT3imLMrT3f/h+qdNrDc1r829zPjCRRQEXNjy5RspKdlWe2mildiMNXBSzD09E6so1nnphVAl9DKAOnewWbTX68HYtTX9n6/Vrd/QS06P4WOQ7HB2zv/8HsHEv/X7veCfW1gqUQGWMO5M1bE3kUX0qJnjQ2jg2bbVjpv5gQrdcGyqqSFpOXmVxbCgF7TXtX13BhobXS/VeBjBlCkqsfK0WKJY6R7NpgMItm6YxXu7Owt/wUEKU4bBEj8kkVQsBqGUyxNerNMYYhMpDymTQ+ZWdDOLB/sSf9jfos/p7BIIOm1TPddlwfBMM1mzE2GmWTnRL9aCbnVXCfjB2gHMYIlgu6nVMk4KjB7uYFbf2t/VgQekikGhCKGnSbQwT1gYKh+UI/f593ci9owh5fO/IG56OLNdqGOZ/LgXrNPjHKHoQBX2B1+kqCqBE5/eCYvDSzVkzBX+oxUK0VtfYCmUTJvIeO2b+lJ/rW+phJpdZ6VYCnPf35iWNjzvu0ev7jNf3RjiTmbmQh76gnZk/hfWWd+ezQR9/Z/2aC2IlZuGzhBbYmS9PII3aOhPTEYV1N/5IcT1iEMCwNELNGr2G+paT6wy17eXIV3czmvdVyOYAPeRoFTXBdG5fOJUHxDPrTiL3M/etXefU2s1syDE7u0HmoMt2MkiIendkKuIH+FHi00HevFqkGO3QDt4yhR0KaDPZhPZJ8c2rh6W/kSYKD291YFT0+AFfJoHcVRoVnfgBpX5JRoYk61yr/l137vPitgO6JkwKaDwlu9GlJEbn5cVF5+6P/dM+aAHfs/1ljRsoqzyfbcm3kdCAAekY5bqqXfGDGuZVtSyDp0+t1zjQC+fpNJ+UT2Xve059/6LaoUfo2VnAs+8Kzph2U7qbPKuNyVSfPi93hSdQDvbzcMZ2rHH4bAyLMMYGRy9IXCGtw+MjzzqgH+Mol+41aMX0Y3/AbvT6evhYXKjF8zZel917ZwdCvPoqfPYq6a7FK+P9BlDtzzmC8LsIUXZcoLC4UOW9nnfyyscQSc28Vzr42tI/IUCZsMSgW+J+77VifvDdrzerDvyhertzDWrTwWdfvvXGvb0Mn13jfdenaPG7JhTmx8fQ4eatpfauHlFXfXGx9bt+MByPLOMnGnqU2NnI4QzuzcnoLfrtkDACvrk3wSXxIFdbqKbSIAWq/dHRPcd3Wfv+RqVPpU3q5IwMVvvm9LptTteuST9SxcXJ7mgLJ231b3X4Q9g5o8CcWgLzjv1HnJvEarJ1JMHIMDJGw8g0j8vsk4rvEneibO2KCDkz+9fC+zJ54Hmv6siLDiuWaLlFx8P9EuSfKie2Ww7WaEyC8S7VYjDwFvEU32Ucno3gA9M9MQmHVdqNMX4z/fVuiny19NTXMsYIb2jlBEYgXfC7YhoXxtw+ZemwJPadjqQvIt/vRw/O+8FpsP78HiOrn2EoZ/WmzJKYfA3r1lo9eiLGIW495SV8vGeHZ/3n49DEoqHax+qAQHrKTxrLJx9hjtXx5boeQlRHD51LPp9LPh8M7k5OtO/QVOEo62Eo9OukGJG34US7rq2NPAvV7edb5ct2rzC9xVBLKCsxJoIhKSoaFkW1r8bSXnHnLIsbysdcRujAGRDOOXzcvSOH74ytRRqD7lToisdE4b324Dpc9rFNTVqkNuY84H4LMnuqlppv4yrCvQK2odY0PX6vxGWL1e7Otdqh7nFZD9bGsdZgjRnDGoNazJJ7cDEYvhC3owAj2u1ecB4wth3T/g1XghFuXuEFnrWu5w3W8wZm3lITZy33tzLFONIs5TArtc+OcsjrN3k5FsCQ+QJfYVBXEv/4bz5gOWaFqvvvmPP9chkXLyOKL2NzhvJ0adhWjSgc9y07GXCltBseH0uE2b9qLpCnlIO+NtLz01uoXHa9b59fvvzL1Q/P371+/uaSbqHQ25Y2c4ztQRKw0HwRlfNgzmFAdQjEsmtsgXfS6rneas6/D68vn7/+5sfXb754+83zl6/+8t03X7x692Qz3V7DtIv5Am53owMqXvefbO4xQB2wWP3e760dUvhVeGGHnr1ExbgWKXPuS5VYLvyw24/Fc9zuP/fFC3tKol181pHBFJ/jxHsZsl212TlNlv5wDdJ3bQdwjA8O4Nj9QdsvL9i+9Qqta6/iRqzKV/Z191f1++6vodQP+8JVvo7teJWvYxmw8kLHgAREnjPz/IAnahhV0iRd//nJ5gcymmEo8B+kyWfb2XSOOzCZtvbR0FbM4xAG8yXHibRcl19wZUD1msSLzX7rBxwBSCDq/wCVCF1qy9MY0t85g37+CnjxHapclrdqqvw5nwMuJm7Dy7Dm8DtHuHnsuPb+AEk/mHiK8+2TTbwvnuIPO+MpPvfP30j0tbH3JcVR1J/39Elj4ZgbqQNvDPnTWNK/S7/lCPh6CKSE/jI86uKGyJ22vvg5HOtoslcqVOyX79//vCtU7IvwBZusAI+UL088x7NXeYT3vOacdIUMJd6Eb3QhDQqzrQlLyP4ttKJo3FtRNMT3VuswS6Q4EFNkEvE3H/5nYg3LPIeqHpGFztaVo7y+zm1x5PdyL1Z032CVViydttp98f12ay0FlsFRniUcFXY4BeUQ3C1agjDEaF+2gGW8IEqmu5Ev2/Mah8w7M5tl6e3Qch6DmoJ5vNSaXvzlyr1Pv0vJwuOQo/qFy8LEUPCTlijvqjRwGAUkKeoYJv45kdHx6U3oVgvf9FDrgK/82zfTpFzmJXp94y1joasMlNGoSY9A7a8N6XVSjew63Rk8VTcM6jjNJ7fa5CLqoctMU7Uh0xmuTAkK4e6mgtg2Z+kLT+4gqvDmtqagYfGNt9d8NMxm9rUJrVeGz4DeeBejBQw7gRB/uSKIrcjC7/n5QsX+P+DlOLwVYdn85hxdBR3ERakD1+P1zZIucOEjIjKW0PkvMT83enyM9/NzEDFpftP12MKPW7F54KlQJBQbJD8+nhc0pyLfT0P4jYt7ZF7ffJs4r28uw7eJen3zC/bCX/p89QzUmEJeEYNdSRout3yd8+0cUtiDKGUlnMKc/X1OEcTKkZig8Z+jSyyPj48myjEnFUdnAIkWHYOjxMIgCrlf8DWBJVolDFJyBgBeJk1fh/M3X1QKYunXlcS3iT8GMMAGeiuhzMaJNxkgI8xEUbduoGIOb7JrIOIKt6ad1ZJ8EaRsBjJ4PCazEOZmJXDa+eeu68hMbDCeAXP1WxzJZCuvDkxr1JwZufxWnUXOrOGZEUmQZDMQpF9U0lAq56Cm10wP7HAGe0xohqJDvJnDWi/eVuKvuYhTUaRQsXibQCnxXWJHjZjREzWRisfyhl51eRfhecwv1psmLzHcCgVoodgsFKWFXn2hiCwUqmWsgoHwPz8nKnzLVzpUS453NV8j3LdzFbSF4rq8rdSzuD5gHG6e6wP+wNbZn3/xhaWx26fnwR7VHjYuabihM8ezzz8/FfJkHT/OtucFR6X8MY5u0UQ/L8L7OVAqvJsDscK4tG8aZqlzdQVGPC9ikIABMHqajwf8lvC777755vu3Vz8iFvrp5cGQd6beNMYY5HE2WXsCn2eEsnh8uh0FGiIpejYUfEsgga3IxuwCu6rkt2p2BUP5cW5fB9vIU7agUDcg4i2V/2ou/uYEGvlx3kdnOilxzT4QlyuOjbv11VKqM3WUh83VlY6yIHSbeMtMNYuv72zNld6WM0OKMAsZfMCoUwtK5Gp0Ikjl7flX8/DHuQzhUwIzQErcLVOhgpXQ5YsfryTEj1ciSu0e/w259cer8CtVx9fz8KHb/e1P4ue5giFSgX4ZIQ+Xqa8UbfG3q3CT38XFLM3vA2+eTGGkcFBBGkXrwOvdx+PbpOqN8wdQ2qyvHp9feYF3hzdkJ1HqbcXPgMSVdYpc8xMvHId7WEX5DktlheTY6ncmuh4+lwnr+2KJHondDX2jRQ4ScAmkA+O/XRms7HzYHpSk98v7/XSILeLucOP1DZx+0LytCm+VgVDzttuRSBxksFLGfKNTg81Z4J154g+B9wdP/DHw/uiJPwXenzzxWeB95ol/C7x/g6pMT62ijosEPeH587wfP5DhJPz5yp4UOU/xvrRc4mmSE4lOW2HVO/I92PXA6rIo8QQHDbPXMuNaOoriGQ1ZUV0rrHMSk5SdRQJLCKw6edGJF8tqjbbVlxJIHuSocI980lEiKKWz41gVc833SZp2xrGukLWmjzPV4vGNiXn+NU6DQh/rG3cXXNMVWayxT7IeehEgYZ7TBcn6UdUfRadCiv3ZwuipqeBa+eQCebL8viMbnHbG64561gu69c61WFONEsfrToT7bD0EB59/jXDTICsJTZfl2SI+dI+2J1/FXzSPKVFoJkdcvqCrrCQffpmLvzp5v8xJYqLPCwEsSxEvbIBlGW5K2E8HBV4OM7fOhRrzy6i8LSl3M5XrGihkFHfJA+Jk0iyIm4QlhSKh31ZF0vRfOqkwI+NyEi1j0mEwgNpWYggad+VgmKYh5XN2sRCJk10sqIee8whctjBuTiC0w2JhP/iG9rU+Gn5ifBKMLIdddT1bnt0UzytQ4/g5MAKMFeAZbsb116n4A0H1n3oDC+gPGMPnsWrEhqhY8aIrF8PS6RyFeuWOT0tYEX6IZQY+J0OuqJPKO/8h7ifla5hdN3GBtLJiPGarxTguvMEb+mvAgBxBMxQkOVvQlp6uujdLcQI+gwBMgO1iSKeQVnn08OGomhREGTlYGdpiH0Hjh0kcT8tvYD5UoYwVeQbbnPBZQqaR9++P7I6Qt6GbEtOL5gqJ2O8ZdJ7Kn5X/LEyoNeIu3GtRW+EpPZy7UffsOYBhPDrHcKDdCt+NlchWeMtZWQhz0Hs8O2GS5uiJhvDcAgbMOTqlJwHZqkVxD1S4Gg1FETgJr4yqeFFEk5j4Wj/0OMYkD3tY0DOnUfns2elJgQbvmxh/4+XsLl5ept0kPWp7qsYBiUTJj1SsCiPSeBN6mqdpVAyOTvc0inBIiCNViHpAX3vw+Q5KfFe8RFCDjkXTokZTxgEzQ6cd+sIq2YeH61Kxsfk55K71sjG+Um5FcuDoAcIKlood88hRkZK4hE83ykfEp2jLhoUqpEv8imeknSSxbkpzOIykJRxGIsNhuKZYDE1aOQFCMYADX6XRGJf6QC02GipK0VjJxznKge4vfxL5wm8TBggTLcIp7oTyhVZCOLqButiAL2MmIrMSMM4r86pkpOPjaFFjK3bHTRwmQsydcpQqcgzmYV5OVXcryvfvI1/WbDEIRi6x540K99SsoePksOejEwhVJeYnoH+mWubnDjUVLVcLpOVf/yTSdlqmhn5mE2LCmTXFbNGDr9MPkaxfJllSxfXv7gnIZ+eDghcT0mNCOv43sd7NALNFuIK2xI9K0vryAWRcB9kQbe5CXAK2MqYKPsVyEz+8w0kSoJsQxYgmjYfim4K2c7NC50dUbUAFjDqy5756M1S9rlLYL3BL0y+bfwCH+CNxKGOYO9NdSCjzSRLCCKXRwy9xkZd4lw596rbnclDwpQkkFOWidGQ3Lo9EuCkX1uAQXelPJ3tjQ6PDqE4u58AxuPHE2aJTYYoALWIMh6bT8CgIjWQFXlY7iU+80DvJTsqT6CRHSv1YQSlp7f7uPtPxHVP9Wo2CGKYjPGwAfVVGT9MBYXBpFjP5HT3QN9ZNCdG47E56M59ftGZHAcDlPeCiw3IoxAfX3Sebu61/HTDeRJLBXXDdHQScseVT2psFLd03OMxiGW4AC9g2QtsYFzOYiDFGJcaLWeL/sPeubW0jS6Po57N/BWixiBW3DTbkJkd4CHECMyQkXJLJGAeELRsNsuRYAuKx9f72U1V9lWyTzFrrPXvv57zPTIzU6q6+VVdXVVdXybgbQGtKI8D9DyBbwlbZY2jw8P3QV0NN78ryj3VfqnAT/ZebTdWVvu3UGldud1i6Y7p/0AhUpnbdUdVzNyV57e+Qw5RrzN3FkBTkKH5Ulfxs4l7Bm+RoE/ca3vgIu79dYPhsUtDKwSGi11Q5cKjkix4x3DFr6+sy8Hb5yoyJaZTF8TRK4ypWs+yOVDsyze7+piJ3cvy/JdU+w8C4wKtjkCPyV3OLZipjZpmpic7ctFC/x9ON6ecse6KidEUyVOfM9J3ye+6AA298YBig3pBOHZiyNS0BzyWiXI9futH6evTS9Rs2v1UI20taNstRxsi9BlQqI6tYqUGp+UIBL5TLJrzPu0IfKsxh/Bb6GVaN/sOMeGpSLGUkhrqq2yhF6aYXDAJ04poJIvMr7zHDIODCbjBBl1me4TIrhuf4ZdSIBXNAxvDAH8SdRgjVdZtJ2Q2dEPeETeCJ0EGh9cLC1LSFATOhaY5XLkukxehH+E2TGI54sHf2gIK0NysvOsDLqNYnsvWean5knAB1h/JQQapsxCyi+TsapI9ZrA/woSvhSxm9qRFKdqfrRoCXQGJgMMVy9WwmnmDxBegxnDMD6DZaLPL1dQpyLhoKvejLZ3saV6nVxuqQKeQ9m6k3uu/AX9ADCwbNpWpdBbg8HJZEdiTG3XJNc19mY0o9d9wCOkDe31hfwumV+yakvoSUiLoFTCDpfTlFBnaJhUVnNpI1NCwiPB0Eesrrc+LM9UAiWV9fHQ3RokwwDwxDTIk603JMoa4ezLCgMb8WjMa1e1CY10B7dQtgXmUM4XE7ADEdfjpadtYQ/VY+dtWO36w5/s4Yzdc2dbbRUK4x7ZEJDamAlQ6AGKDEZZARWvgaqJDqFP+gAwb7dhlWCp4l+2jIZxswrvMwgCf7J+0Go/i+VMv7QxtKPUGbJETA0447Vn2dzfydWvNyujb1y6UUyKNVTvF2XpZdwh8NJW3lu4iRW9B4wUdusNa0YGlWLHzPOpe6FO2TosTG10qztFm2z3sb84EDxy2DSq36Cm2LYT7UlueL7bOix01unRj9V7MttCM1kvsAHcEDEeh6wEeCGCb8wTfoveZIj5ZNC0iNA5SKf6ibH6abrJ7hR/gqdd7q8yV+XpsGOHDwzJ+yTO5rqC7HZ+DDxvz0nLTlxteJZsQ/p1KVFSIfnD5le8v54KDllt5EQDNewTZxP3SvkCm+G5IQqSKvGNx6TIdt1oLIkSxqYSm0meA0V2khHDHKyGeFi9Uvs9lCiYBEAXYQYKE5VQsw/axL8IQASiF9LgFJYXtDZltcf6koxZKMksZI0N20tDd+2m/9drmcdvinhl7QO5sZS1paTJhvqWq9b1xTBWk9FWQy6E+40Oe18tKGv6P85Y1Va5vwz8H9gAJ3j41mj92gjDFTeifoMq0UNH2gJEDkoCemhzrgOhVeY4idYSIVUNJB51xd2P+0UB/zKxVUNguvjMBPjHFkynr5Y+nyGKuIzY6NNY8oLHhjFsKH+GWIpC/eCYEObpJ6V3KPD+UTi9dXfDaSi6ZjwVIF5OAchb6nqUHKmOjAH5nJaNkTuzvDRBJN2C5S22DZsGG6AwpK4l5WSrgw13Id/CE4YlCBJUuaHmJolM3o2MbxXAyWzXzifEl2QNAecsNexr4PXcV6CH8Mkprd8/2Ce7cDPhWvQWV50YsMHvZENAMhVebkTXnBaVF25XEQqXSEN9QTJMvsZphH3iIBUF7wlfSzSdS0MG2KcaY+RzSc5mA55mu+y+gS+GSo9E7IMZMQLORioV9ZIQ2WkoETZ8UqB61qEJEZGC9ss91Cb1IhzRLAhIca4tL3yRA2euZ3tMuQjIUttaTIZ/mysnnJ/bIlZfUk9UcrFtIrqyCjX5rV3LYMPbChi4pcpdiFBaAILbGQc3QSr1/Ppya28Gj+N7odCSeakbuJ9fKXxBVLFBB6J9HCO8Z1dTXl78pnEFpSLW2rLRmYxpo07uiGsIqA2Q9BkKc/XWSR+01VSt4mY6F8UGb7ziaI1H2XS5IJZwwCrk0BmTrQDlJns6glwvgFVaFSga2OJH2Bdt+HpSEGberZQEOBm+xh/F2A1hCu9RQVMM92KOYEu3Nv3J2r9g1I35bKBgtA5bJEhEE1AGjOL+ztuXjU8JrRjgsCyUs3adiqjUKpmALjdQdz6whbcq9Vui5F7B5Gio3oni4Ur6ROVE7ZfbmsxVUTTBOhxC2Q1gPonHMzLPH7E0Xi4kwy1l+Ai4hvBwHF0R0raQSwDdLwRNLXUSalJ5OhmBBBrnLzgQHsFhEk7E4idnczRssmSheXFBOjkBy7yQ760VdKHgwsxboa7SjQ1MMzj8IlOmaQSIkCrpyZuJnsuJ6TvARpxBZ36rCSHrUUvsLAJzDwvaUDD0PdLwy1ssmA8e5nbJCoHUCPti9Zsj4ekksLMB45YZXSYPThrw5MrUdc367Mud6WGQc8PFmNTdWUUEhnDHOJ3s8L+VAPIiZxSkii3LrnVD5ILfh+gB4fMGjQDJ3f+6PZrAaMHcBtCgQinGneClYeBEKnz5+X0ArMka6K4VilJjbDFsWddlRfYMdo7GnWeJAI1viIVMTjp6y1nDXuttwRWpJc8LMCNmr9xBnBxb91JJCIkx2PJ4Tuonx0EIAxbrrqCIGfFeTi44Xl3EFAkOypsyIV4ME0ucNDAZnLYiGTpwqsACh3SCUhxU2Vy7FKVj6nOBFclNUuZsUDNkufZIzG/l3hI7IRcVNBmFk/dQSCx5HixE5dQIapEqdk8kgEgyG3kEHoi5g3cmmKpYuqckPnTa4gSD0r6JwZPaNvaGd66pl4nh5yOb1swQFN3zyg6eIBTR9XrgrIkTuiabQ0Yo9aArE/EGIHT9nxcsTuCcQ+HbrXiNjDMUfwt3gWguy0jz8Up1AdCHM99Djnd59so9VNQdgbJb3XcjdF4Cykps3hWJ4hQjHioCN3B7UIEYa7d/yiD5w5ZjPSdzaE22/hqvsthv5Dpk5emDdz+XYqN09OBxNT2EQGf4q8LjRBRuArnk8236KNKMamgH1Vxz0z+hMAi3q9gFD4HP342b48BGrW/C3H/AKkHuGLklH1261/S25oOH+F3FXCEwWHUDjCXl/XKWiuTgk85k3D9lz5DGA8AQaGNpK0CUkzP+5GFaMcz1goFU+H0DTfVjazGRWVi1PWr4CJU/+oGEi0vgh225pmVqcAWizcqLBwe+5QHW+LTLQIIdU0oMBl3EMzFNhrEB80P26KDLB+vAjtmbiREm/lioAjBAm0T0qrFINYbNHGjCH3HkToWjIhv2a9gCyd6TCOFxRnbiO31xJtshujvFP6kSsHl82PDTFzvJ/aIZG4qIt9NswlcK/pugJtWN/lsUka/Tks6RexpK+wpO/KZwDVN5CNj/1mo/cyP6eNnlR0j1zxpd3r8NuSedKNc5nHF3uKWxpQyC7vNjr20o85Jw6j4n6yAI26LLSLpWgnwLuJssd845p2VemuHGixiRgQRmr3KI2Ar8jmCLG58pEhyxrHmihfS6L8mohy9JQdLCbKB7rM9N3u7xeHrfdvT/edmr/N9vZ3jy82UaXIH1841gvxePbhQ+t4b/ekdbHrWLsi8fDos0705nL+4Vh/zOWExL9kYuvN6cWH3ePW+9P91knrBHdz/uX44O1+4ZMtPu2enLaOD05+c6zHMuUdVHiy+/61Y63LpFMHr2zS86vdvd9ODndP9h1kZXTa6cEeALkUKXu7x8cHu29bF8et07Pj95B3LL8cHO+dvXtz2Pr9YndvDxrkWF/lp6PDI8jqqNd373bRzSl/fX10eLh77Fhr6v2UbPTEy9mrw9bFx7Oj05bzyHrEU1sfz3YPHcsVmVq/7x3uvts9PTh6f/Fu9xiauyq+vDk6fnfxptWCPp/3ddrn3ePXF6KzGyJ5n97+Id++fNhvAbSD92cnqAc3ZmL3/Vto0atjGJsWtPSl+W3v7PjwC31rOdbU/HICTT42irXlx4P3Ld7Cy/91yZPeH0G21u5vFycfCM75912JaYgyNLT/lAmH2L6yePt41joxRqGZQ5NCu3dyH3MNz3Kfii3viK8nrXcHYmYbMumA6uCzZT2SqbwbK+L1dPeVY/0/chW8fw1IuXd0DBkuRNqn1jEg3e4hjQ1ykzz5j9bx0cXng9en+zBC+QG6fdN688aSpibvaWUnT9m75ezWsMXZLHNpfxsWV0IvLKyDQctE4UlLY+xVa8livW8tW6t3rSWY8721bGpuWstRam34wKwdDhesp5PWgmnbbS3Ewr3WD2bhopW5r/GgopXjtIzg3YbT2oUmNEoR563IfA3BqM1m0wz4MCkqi5Mi2qyVFZPSK8A8GjlsmFdikyW/Hxi1n0yi1PsuFIEH0eg2lexGCVWg/DmzmeI+AOwKqjU8aOg4WSEFsX2phG5+8YT2bxYgOGfMxCX1Tobn0xEeUEfA60UgSG7Cbq4i5fL4G5sYT4QOksbtfrmM1ibC9e9d0VowVgk9YhdKcd42MDaziDIFILhf0/5adu+EeCZYGXl0L7gK2pbvbHYn2BDXw0cQBN0Y+nLH7njwiivhZ8K6ihOybH7ZbaCgAFxyO1FRojps5F4DoqyWUCF90ZrN8O9eiys/8bkX2lMFi1oq7tiX/OqN749aKH8DgjRHeLBZviZz4xyLAUAOh0uAkM3eaEGJNSgRlsvc94hg0152YWTvsL12g7evjP01cptQ7kTjIRPd5Cp8OhyiW79KhYX8It8VsKg32cJGLmrffcueeq7KTlNhafxSJ/yezX4a5l2LeqVFFA51ydDlIKDnUs6lLcvLChM/V/uJmPxd8XfQkiZSIzahGeAT/vE2Tv1EGi2PMKCZmJqJMTUTPfqTcnH88eMd+i3T8KQyDPPbDT4Z+PzzM/Id2tuTGOPGkrEVD+LUrlIjW/o1azbzhCzHzYONueSsN0M+GBUaxE6jkoNnd+5Yzx+l106PcXNnZ5NxAQweHp5/4qwf6MFNcf6lEPDjMeCdFqx/Q2ODJ0ygoR8SyJ2BEz3A/x/hxaS1vt5D4ZKapmVN+YxWPVS7JFA8ABdGFhNC2R1b0PxhC8Ym6+j55TKQibDCnrywrrFNV7xNKL3zPLSGp7l2kOLJJevzO0Oc/JnRJH98JkU3O4+KbkWqR0xSem4Wzryc7AeTuIWNLKQ9wdEzrN71ULLcxmGsb5GjXGYYs3NAou7i9vKG2NM7jgI0ORP3rn1nzPFEtl92BPrhTlQ7KhUNW40WjsOiwVo2nFkvXuH7jcLFnFCNYyCue8TjFnpXuYfd9Z6nzWal+7wqFT07ST0uqsrvC/Ku+L4n0B0zFCDJzfjeGHpbxb/I74owYKJx0ueUBwytRHB+SXvC6PhH9MLO7q+DEN1FK6eBUghWI+TTVsyirPFOS7QtKQX/Sbyy95S9Wc4rvxIqyaOWe4QM3mnL/YB/j1vue/x76M+r1toLrhKMtYIw0FZkwDYd+jIOSICKmKJasZkqN0x4vCBOdoRDJjNepYaDx8C2Ga6xypVKStMPw3c70jtAShaX0tozRY98adY49LlDb6N7x9x8DD9pMxL9ed4MpflqWJJwuJWibzuvhgoKemyGKTRglBZZ3ZTGbg4Kzobo5aHqnDELPwVDcNenok8qLm4U01VLPThp0Xso3iX72SHkU2I0jiLS010aYcWy1WyPO47sBr+io4eGGueoXvK2vtG4fOhLjU6AuBw/ZZ+X4/IHEE58jBd8NgbikOK9p/PzDYv9NXQv21/Xpl6adS7ZhD5ULXbQwgcQr1/TAwjUkwQfoMQ3SCk13aptsbOha7W/boBgfB0KS+hJks3W7Ev2aUgJX2eUBAnDEE9HJ2k2rbF6tja9DrNLttbCXKuUDnkO5eunIeQYhpj2zsgy3WQ1XhQ+vJcfeL5XLexIlaqDnrxpYXVnw+xx85LtD90pyKogV5+2jncPnUnKUH+g3g9a7CNqDlTC6xYjQViXSNjR+9YFSoLON5HbORuy1vvXF7vv9/aPjp3rkEEdJ0K9MgwZCJIoIK+1xNOJcygfRaZ36pNIeC8bIsq+gnacQpVv+N9TWReMD/uzRWed+8NCU9FQhs8mb+VfQw4DhuMvPhxGhcaUwGyJkjSBogXm9MhuYBrNrchvLwGiisjKcvO4OOvJXN5FYHODxKeddzk3Spe5Rl6ak3WZ723G/oLR9EIQqR3Lq/y1W/ljs/ICGIxwdO3JFHhNukGAYtT3zc0K/D57Y7Gr0ItuHGvl/Bz2426UjkMjQ+2NyEXm3I5FQAdjb3RNmeo1gtKyWBjfYyweqMhi5GOaf+e1tFYgEU/IMbGyem79Y+2f649K9vn54zKrbjiNl+5O85f2+Xnn68XldJb9l8WSETCzvFXn5+Pz8+j8/O4cNYG36GrPsag79/G4R49QLbTswmLfRTt3K2+8Sh9bmzU+L9EHb9a3Hz/dZh+OTg5+vzhuvW39fnFydHa813L+ajH+rhVKG+fnMKHtx+Um0JqsNLPb552OvTEQGd8fvb84+dDaO9g9pDV24mx8bX/9ZRVyVdkaloJC9gzoT6e8IcoU8rcrkK1qQF+Yj5p03HrjbJSAqtml0vlnu3S+9djWbcnnf3t49AoW1UZpDr4ucdx6d/SpZfYWsOu8XX3cbH+FSTnvzLD3QDF5EXL79671HlbS1Hr8+LFFqmp42uDP6kW9Z1Lzvv1cKt6fPJvXuz99Mq92f/FsXuv+YnNe6V6r15fo8bY3l+nxtmsFlft2vahx33quFO5Pt7VO0dBDv6gvVrDXtpap119sm9r1J89NzeT2ttZMbj9doPrb2jY16U9rSxTpW1tFPXqtvkiLvi2G9+3xLmCAbOBTQ7O+9WSBYn37yVK9+tPNJcrRWn1ruQ70Ra2oVa9tLlRn1iR8qVHfemYo1Le3FunTn24tV6c/rS9T2dbqTx7Qy77YKirTn7xYoJTdemGq0rfqWpP+Yk6P/uLJIjV6rb79AwXu0yf1Zy/YSeuD86GF3gzRGzPe8UeTLyOsztRatRwhW5ARnVRbADfk8B3REvqLS9tGLSpuRnjRjllNVfLbkHwTq4KyiGU3YZlbZZVxFN4mC/OVMd9jlQ8DVi/Mh2TD+kXl89KFuawsy9iC3q4Iu/k/W87+MJMnDN+Q0zz2lzGZZyaT+anlDquj0EvReAs53/sg2qpbbFrcG/Zby+jo59ZCWv+29RCp/oj6eHQxdUz32umKwL9wgwCLX3sJmdrQ2CCMty1534NDV1/5PXel+KitrxeLizLcgorb3om78dy94scWg919rWZRtjT+ECfB95PQS679JJ8Txsva4Nm4c+5XXvcmWZQTxs/HSxAuuTlAYyWfikknwYdxfHOFwRx7iSsd3sOwDKsYcRz9eUvre5LC05JVFeHcuAGvrQ3dVc+31tfRoH/HfQFyDrfsf45JNUiqbWZ82D5DjfE9b6yejuq9SNa3fJsq0fnUEuZoZ7RIRZ/0kB56iXl7WnqOUM7hj/rkfkBZQLrowbo5dsbtoFLryCHKgeO2ipWajWzyWF1mCuwMJkolwOtlpidDeA+dUwzoiwq5GPPVDcsWoiYHV0cRk8c3ID8lJE0ec8P8o9t0dJtK2Cw1KkBLdxnGjozbv1rc3t1MW7O46WqQkaw2zmy0cro0BGCia1JbgEZIyEITKw5CXPXxGl4fSCQ18Acod94+Zb8ulzvfDt1vAZ435jmFQaj4gi+thXzBWmDu678ZJ46TcMmmfRUu2qI/DpdsqPfhEo7nLly+0f7eMrbLP1qLtssvw2Vb4q9Lj0R/e+gM069zisZ+51ehYHo+DvmdfRilPyhxiub0HPfkacG4SrpzF7+8BQqPaNesbWw6NRtwp164hiOPGsdKMUf4M0JUFSsPULTrRadxS+iT5L1T1NHiT+iOWRdWlT7S43bu6IAIf+7wZ4I/9/hzgz8n+NPCn1P8eQWlKJytOxVnVpY4AYB1R72gYLpfiFx1d9wAXfjCY2jaXHcxpsNH7nvuvXvMch/L5a4IA9Lovgwa9vTY/SgUt9dkgXZMw2pPb9w31SuDskJ/KSvDDPchOb9HJ/6mYvhejBTPwv3CviqXG1/IkQTNCsEQ5zYPVPWxcIojIb4qKOjvBVz8PgkVfHoTx4pvYP65nxk8mKBXHEh8O+XXYsgOVzma5+dBBdi/tf5daAjl1xa08FWlAvPMHXoSIhSAIhhRjGzvHgL4cUjNEuc/XdR709Mb+0codFoAK2Il4xh28YIz4NC0X3brerR7+QvJdE0nioFZ1FPrun+0+Ox/EX8HoXgf8r9XoS2o60UJn+74LOUH8o7eWpwNVSPLi4vmoR900ryL4SFU+xfwjGN/EdN+wyPkubmVk6JPI8ypGPCevKdHOqB8YxAeauvfRZcvwwWD8+Niv7fmh+PaN8bj2v/5hUd5/ToGJ5ZYeuOni5H/Z7AWcYZvs8bqUtNqT08AqtyGAWy/sN6xOJ1UG6UX4tDP4gUW/lt48TAmXIlqKYLF0onKxMqRjMad3CM4IT5zQxaS3fcu3iro4+EjOkAPFQ/Wx/tc8rWPZ6swduxsff1KgOztbDZLZ0aJng3A5GvPth2eEzNRPaHtYLUA4owu+oq/G+IBJuj3YenM3EnO1E5JYUTP3DN93x0vyKbV24gzk7Kbu/jPfTuc59tLuzY1/0ZmPVuc7cwWpxd77pQziehUXlrcEGPp9Lm7vzPuqG6XCdLqjJhCXwqIQaTwiilC49wxvV6dCRNY6JzIJ5mvRUGaUxBSbvxInYPsoenRa+I4NoFTKR3beOwvqfGezO2JUKEGV2HA4Sdj19rI95O72fj0Upn3fpLmvS3fvfab1365Bv098N2k/anDXvvqxnDLh1QMjMmBQ/s+cfvm/io5ZvMgv+KY6FgYE7hPuNC3HeP1tQ88FhXAbshOll3KQjuLzUqfVunw+zUduSJLLwyCX/s2RoE4ELRkfR2brPw38L58Uq3Gj3YjltEnmNF8r+3pI1PRsk+8YcaHYgvNMryp2V5VLvMEMvOZiKXd017W+FXre9O64PQD4vT7T9l4sJTTv0o4k/rOFxy/oSy+Txbpicf1perfoP6g9jaq5/Wo6SBzrxKW1M2LsPIavDg/I0v7RXfNchnoRi4dCvJb4PKskJxEiLvAFcvOOpfkCJVM+CmIXykVzj+1a2MQacV1knc5wR9vjAhQ6ERc3ZbP2GAsO3D5TrhrRTHNwdu5fmatVFZw1OnsjieksQjrBeI5Bgs3bPQu2fdwwXD8S9aIYzcdtMcdkDnEcNCNpJ+3TIT5z1kmwnvkaicmsF3+nHWis4ICa84qMRjeDle8EA9QekauIBPGiYlrmOYxxRHGJErjofqYvGXPZpaVUVBXFGbm7onj9U1Dc8HvEF8lVa05C9FvF6TklIfAkOYOHnv5c8dR4ejuWh8yXpmndHfyNG6SP1C7Lxya3Ygjv5P8AZk4RDzNn469ytwue++uAa6V1qZxxrWYa9NX2dp0rdqL0+ad0wOh337ctC+BH0gpDcZjAqw1fzkB0F/gGfaba+FmA5aBc9pQ4weE6wv51/pCngcUtojd33TnJhKJ5RXPfAYv3Knc4Mg+xAEJk+90sKvHOIfwywVSvER4O4Q9S8+whQdqtFHCEzI5KW6BaGIm9zdkPfi2iFZlZAaGD8Rl4cM3spmDh4HcG+kSHtJlx8tgbbzL635gzV3YJn7zAC8gIJ+RlExGTbtIfZnwnXLBDV8wvBr07ZN7UR35/o1bWnNrZBArvpfXOgz2vYuq17vDAKLCXLZcFt87iMS4GVK62FJkWRCJYXsEkOihwgfhC6jCRVUOWNldYzKn68HK/jNAzIAcfBjhu3jil1yb8tVZE75TX/sl8Whn7OBO6xOhE1zc/kQCj7WKk/2pVCfXiiVrNvtU2qIPTSA0dgtjgF1wFVm5zNb0neW1f9Zx50aXshcmh6wzo4UR+0s0vL3WgaRQOOpcgy9vUvUFLVF9bimVsc+UTBGapJWTnGlLhO7AQeeIQazoWuEu0Wy2VrxLxA5gxCQ6c0bno3bfobOPgpGfKy/MUBtryoCLtmsYtLWCqer6+qoHC2z1AADKeXLlg2ZFd2WKdCokuilODnalI9zH+CygfGF64mUiRWnVfZhvTelj+6PBbgRR5I8Rb8TVXYke2FkBcX39zwCmhgFfvFu02F4rWmzvSjM6iXGqtSX5hPhvl9fyFt1r3F57V6oGsD53LWNnAawGWAoSTw9oU+u3Pb+DdKQX8AvwNUYdQQ9SjQMJ6oCbgye4UukBUgoTQKt+3y0ZW0nJIqvtA3Kb2/grKPGhSwBbPgurtTWxQ3m+pF8SHlLeq0znlFbQAsfQeJYXpRUkCu9DgY+82weA6a/vCNUFSq9xc9Wy2USbmsgOcE/WMyCOu/hi2He/8K80LjhR9GDcMJYpOvQuV3Lvu7g9ACbsA9p8mc2uoaWz2cbXc5gz4UjrAJJImtLtcy/tNTxP28ersPOgHxPoA5dKrq8DtCqeum9UOxqo8AYDFPN7WDoQ16n7XpJicJ0E1UG2nLV8vdOun1HV9qXAI73OgZ2ghZcXjsjM8YdztCcnCEitDYRJY4IQrVTjhBfK1Y3S1/bj1c6svVFC6wO6oaqcj9mC0MK+5KEIJM9/gE2G7u6zrs/2fDbx2asEsH1PHQjBbgBNOrAdntS0mvvN/fIeoMTEb55Ib20TdZMaccN5Rfa/zTcPZlLpXZ3OK6lazd7Sj49zLfhCoL44+80D5xI53oNMOaSB3kr7u7yY3YQR8Hw1BBuACgMMfubMpZfhw4G7cyDawLcX4q0t50D6NQB09RAwnlOpwxShOVBEFzd8R7++M09rAJPZBZo/XtgU0reximjP9S97Li3WPZqPTSunjNwTk2QL4vSpRBeLD6R3es51CSffB3xkxUMjD2n1wJ7ulQmYph6m/fBe0bh934VlBOMDG5jf5WsScAg9D/ZL++vr++3NjlzudZgB+GQkaT4C0K7r/7O+SteKRQvm9SJNPgoOZBCbv+TGuAX5j5uMG5MuRTv0Hm5MHRgQub3Ba7vw+tXiF29S8sf1Xaw0GndHDftu7kZDjc+BQX7aRH52OQhaTcZHAGNLoikBmQeSWBoHNl/JJtsHnCim7pfrNixhd1xv7/lkZDzx1aYIQ12G5X1RVQwuNoWGczURaImm8dK+etfmh9Ql+dG9Mscz49jXBjT7xF1gOzB2e9J/nWDkOtT1PZeW5h5S5z2eTAPy0LAXiokJEAt6TzKJORhUxIKyTPEBe8CklqYL8IHQ4Zu86YJzCl14ZD2CZeAWJPG9n4SHjSIICrBZQ3MT2IR0/oLNj1FXLvQSINxChkBuIQ+UtfmNCcmKcDWX9CD2Sq+lnB8wU8QegNSPLAn5JsWmcLnrwM0xdIT56+tGNZILwqOS13fAGxJDbbRwSSc0a8PLc7bj/Ny2CpvhfF/blliyUSzWu2CuV5FKGUuvoxa3yik04H93ZJAZ4CODMBsacbkdPs6aJD3Q4s/mxSZIe3DmOst6k2OIJSS1Igw7k2XkUQ6xamtxeeRprOFy7u8jTBuH5e83AyfaGLjl5HZX02eYvgPhLvIryj8HczwmTM+GICvLFjasVKEtM/tam83eFU12gHHMhd/eL5IPUQU180ERzJy3JQ3YtA1pe1/JZft6xGQS19cgWzpbkzsA2mebMhsXgeYwbkqcA0c3fgDF6Q4XbtU05C/nFSYTvTDwR9rHlIQi93+uGpHf+Ju8Udw4k9IIULiDBUsiUzvvWfssT3xUu9WS/xH2L2BshJenA9QZmUcOANUTE0abr+FyeYLbq2pKY+JzX/Se9PPhtyd+p3iNELJVKnbhG9YJE7DnAwfEL+6JDAKL9t2kXtpDM6XCVp5Rk0nZIJcBdWA114E5xJNCKc0FdUvNB89yUDUmywb5liOYEmaBKKMzB3cfnzJLYRgMiDE8eKdpz7c1+oEwIAXyiS/w83PpQaTaF6RfIiI7Ezfq5jBkBhjy0YhcnNc6aMm9XGY/v/8yhXZ7bL+AesDxhn471CjQUXoeEgH3+cQQ80fN0/Xmrlmqvh4sasEG3wt2C5fbtWpQ6rlqSCfo0VW6PaY1eajfU9OEuj6BprtusmBj5rqlYgOvFzWwKtkMrQjbLdzbNDi2KucCRTt6krDkR1ZqomhdKH0OEmyDdoulurq5YAfzk3Ke7dnV65Dk892CFu1HFKOXLWJfjNuYi3PKMWryMVot7ebY1xJuTYZ+W6xhwUeXiKXm+lAEcAb0WJgJ7+XryLEF8r46p2ufiBK5eySi4eeXuD++W2jrWTIdUIlTHwy9Vf0zWbmrbaLnqOtgcO2PMdDe2P92G4z9HnovgxfY9VZCDQoIXSnXUVRVtFfdl05HaCf27dlMN2jjZQm+dmbn9+Udu6jzgfZroeDheUK9TMEuAiZJ2jjoQeKzjgKIqbexDTQQI12A31qIB4vznizChFXN2i2d9JKeddjN8sOGSnEUHhEZpLX5nj1nCpKzJNG0AvaEg7tSQUSmdpV/ol1FZOSm6Itw0Zh4PMgfS5eiJl/KSxfGrHgDfDc3a5LjNeeNo3tuJvlOO5tJErCzuazahbNp5hgtmsNf/uZYKchoa79c50exD+eb8+AetUrKMXvKG7YmpfE5WVqQ2aBuqG4aB1z9gpyzVs4caI2N/XMbZX6O1BEJTglZeBEvgptA/nhBWH+ZJD13zpBTWVxUB9pgDM+U9goc3BopehsLp2Xj63mp/bUpl9CaWD68IUX01SSCn/MIiKp6zlktaAEKKagJBj6Bnwcg3T2YozgHOYqDvNc+8Qq5aoE0Ljhz4r1Th6pQbLWLxyYwY+vr+MsNk0wqxvv4IKIJVjZ3kHUwd5B1MHeQ9SpxjZOrg+LJ1cHcyRVugF0fWdS586oJnle9Sv5ew0lruqaYWn5YiHfjGsJ8BuMVSLzeJlHhUwArMxDDRCZnjTVXgtjCk9ASQQBgnLXOa/VRQ6sRWU3MQhTGIw3NcMnkhxE5V6U83jvQ5wuaf1nd82VzHpAvS5JhL6vDOrW0FS/P72fL1+ySLeqf0amyUgmIWyhcTTNbs/NKuHxPtRAw16Z/fRTWhMy/YakZX2vXOioeI+yfaxQ54v/LMbpcm+Iw4X10lMOv4eET+sTKj83y0ZjHkHKLNO2LmXP017dweSzAX3O8fg6L5V196orqlqFTcP/j7f5XjqyXoOriIf+5tSgOQx8iR1+yAkW2p56vRKzq46bFSnkG02RThOBBZ5qy0HFZPeO4ef6/xg2RVKGYrlyz9opgS3OS5HwjzRSS6HLtwBR96FV27w2J7d42zHDMTDdGphvjkKzsHhtfjm0mDhoeW4Y1Q9m9MjJd2WKs+I5gnvg0/iUVZkGza57fGZfAZDIpOlleaylbIvnPf7cd9k+1o2QVzoyN8fD/A63IfqoVUyuvscmMOsWOsUAekxxjEblt47Rk6E2u/Is8FVFE5BIJU/Myy6vI8vpTVwQRIoYRtVNS7WX/vD0TcAu3/X7wPYeOMlHZbF5kje+hPq0v3Kn6v8NKsmDcmcxZOuZMGL2CzWKsbRZzDlC60maxr/yG9ArmiiNul3idt0u8yvKGlYnN7oS9YQ+ATcTzCJ7vFxhq3ohIKNywT5n+ZewkZ6hIZNu5zlkqnpBm/UT5tWy5x+7OcVEoaKIDlLXpvTKYvIK98pja1HU8ZTB5ioWnIljbMQ/Whte2RTQjjMG6Ng0zrO+SArRBi4yvXvHr42qx8Em2KNvGomyxyDbJZVU5V+7KLQyFI5INECJa7Nq0xXmCOLObHEy+VihT/ZlSi9v8eOOHhc1CMmAdrbI37sbXEkymfV4tnd+X7TVhtXDMBZE3wsqbJvSLe1p6A4yjMiL50vxS9spv2vWOwzlJvA3/aoFB543N3kPhV6rke32QWCB278vIGsZAo6BM1hgPlDn991CY0ydkTt99yqLl5vRe3bhLH9ddfwDPN6Eb4N+TkNvYh3Vuc39bL9ylfjg4Xs+X0XN4VIWl8bP6LjdhH7k7GPpGBDMQQzAyoqtfI5Xt80JX7rUIZXQlTeyvMhncLstEzNu6CNQjLzigTRcaYIngYJYRhW/V8OW1GvzAal0EANWBrOKoQl698r51I3HhNXFPwjy189yg2VNOuI6FG64eRmm8Ea8YimeVIvt4yEqlPqAkAIXqxCt3iI8msKs1EdVgEMVjX44qt0DjaQ4F3omjd2jHL1+OKWYwvWWN0O35CgTrYxwZHsq11Gc9HRhjGiQcxojRnQAgrGJPA5IK7SelSJ95GK6NVFNjChP13UkyJLEyjXoAZJ34SiD3Io+4ZNRXMFUlqlodEYRPXFSVHTGvXaDjfZmOrnVFaOrSXVUAQjO2XvMOyLfthKW+3SwZ8A5oEObh8XTuqncBHBME/zgHgZIRAJXZtHVvUDXNJ9aNbdbNGmIwZUgkPnKBGKko+zc8QNMgK9xVGKsWhQx4LMccIzUp4Ups3ykhNrqCRM8bHryWoiZged6nBOEWojACDljoxuvrXtOjKI2y57GIXFYKXfkJCqAP38BmpVgcmye5GEs2WRURbrzyEnlWm+DW60feUNh8xS4tKJFJR1mKMcgQku8QmH3VS+F9D6MZcqSLZa/DjGZDV6eiVOWWNVAtd6fkw/DCNEZdnBN+a6fpGyubqBtfJl5dNRiJYYPCEXHEUT4merwEOvbomQ4T4VORmjY5GU2xkHBEmKIjQucGgw4vskdFkHjbXkKM69z/n0mZNBGH/ipKnubCKo1Nc2RN9KI5ZxFeMW0NWG7cyRLhLEIqRWzcjC8bYyTZBX8RkJ87i4jJWYRgo0IiPjxoUSk2HC4GslwoVhdG6RPzeSP7xx1d5Lu4Ol60OfzwOtPSrcDkGI1p2My0Z4yiQW5Jhi1Fq0v5zG2RIymF3BiSgXBeGamD8VLk0uRjam67iUSgTU5mRJg2KVfgnTPDX4MKc6avoY1BhuiH3gB9saJCGzmsphVwW1ZxQ43HJib3oD3/6nZgioapgLmx9nWDLy48WYZVAwxMWG9Emp3pSf+TMbEzo6fMW8zOeLpMMiCX5RT4iUr1nrLRciYoHBgBgaGdf6Lb1Th1Y2SCdgUT1B9IrxjkXJMmZcNi3YERjXesTB9RblXTulOpcc5DfMssGGZIzFjsG85kCqGl8oGnRERY4QAUJDb5lKgnD30Nu32UB6per1fqK91Pimyk3A3NZ9j3MiXD9jHU30tpgNDoy0uwPTdOZaRXv93v2ERKUs0/xBnxKSO3x1eYXLCzWSFBWK83RrAJlMuNHFs3lmxdr3SN4BqrpVFz9UoSREc92Rg1sRlQF69kF51SUOXckU6DZZDLA4gpORoMNic72kTHqknHIf+qHVv6YoVxXA3QUgvGiJ+VYMge0+m0MKEPQnX7Zu7A+/K9uDnpJyv9+Dbi59t4zVLczGQrlp1Zl+qoCbdLdWMZXzRs5dhH2jU3fSL30ND+vCG67fhG6J5YbF5u7KtnX90CjVNO9eMF2w98k9sPfPaiiatzYUoUSwZF8CN5LKYWctyZR+F2ByNHIr1ZjJwxTiEZcsXqdhDuIMIJbsx39AIyAptpK8yKeaQ0j+YR46tytIlVgFcM49ih8VFW9/kQuT9H/y/nrrPSZdpwoELwjtU053dtHbUSduIY+IAAxly3BhoTkDRk3DTWTocJB/sDCoHZH2hYXBww7q/4NvoDnvcINVbuoMy8EsqmxCA95caIyyZSSECNYr/5k8IYru6GykUasjkPb6AYRawfjJNURTOWjCq0gwubEpMAATjU6g1UStH50KgNo1M2clHwAjtqJx13DD9qL6MW44jPufPKkV0zLJ+J2LYIfqlJY4RBsHn8RZpIz91JSp49N5rAd2HV/p0/nvzH6waSRYDnaq9lqhm0kMPwvxfRZQBlgxTwhgVEUwJOUzjeSMa+OBi7eeYaiUUquWgdcVlgI4dByMh5+6C5W5RGoBUON6NN5KpLtPc5JFUwbJ6OVQgMqidRm7OKIgy3bgclECoRG62/47v+muPbtRN302G7MfWzWbujvblTRMjbgexygD7ObeGnPU4Fox+ZLtlTajNXmf/HLucb3t4LFrJdnAdyMg6txNp09S3tOv0/1wbVNyXVcNcKmhIBuX/Fe98dNEaaMYyRmZQS+cqQt1aFq0SKBvQGOQA/aRh+2WPlej42iC+G9iWkAQlXUKRRUh34kT8GZufUS24Ia8U+Z8x2LGiS8rsfV2WMbA7P3RkMSiEDScRWUUcomwyrnc+2Kd21eNxJPCOGRo6W53ZRqvNQ5+RR6L53qGur83fiIPA5U8MyyA3LNB4HgyDyQpDKyePLWGqUfCa0YJBEugmuRxLV/nFNqjdBoL0kgVIYqXiIy56luro+6ugEAx2CrEIiscY3HFPO73wACYcY46qoF/htrLdJ8bA3UHjE1+wSWmbm4c1tXq5iDpEMmdQzG+vGdOtm31XsSRBwQWgY78VRPxhgO0inCKwf+o3kqQp7xn5Ic8Sd9g9B+AnGXMIvwEAf/nwmgSbCroH9doeoFE7i8I5IC0hofDhAUrN1K0fGkGEkbC2vXWFxL0Rh8GQSddVootEif8b1Swg1JR8kNKUgbnOZbSp3fF9XNhkIuqy8XS7pOC0buWQ8tWQwAsm9sWyox6UpJDoe2q/5EToBdWLXuk6HoUUxGqYCZj4HcHasHTHYya/r3M2mXFEe5/OohTGOIZSiMfds45KH6De2swhY9LsdAHTd9R6NMw/oS3t6AruqeSuYRPHV+wFX5yRquyW3BFlDYhELzOWfGOKO514PquKkQbLlAKehQWIYZxl2KJVPGdcoAJ8ntzFOXCPkcKmlKBUYDRLkAScp6pEdvsrRoIgu6KfUzBsDt+Shs0VCSI7RpWG1e99D2RjIjTAQIwvs0L2sbuDJidDFdN2rAdWElRgDhpIURpXCcC/sbfXeg5Gyrsax16uICa/gCq6IhWmx9uWX+Ha8cn4pPp9fYgRvQLpbILE4QxI0YIBUyd9fB+ipJo5vkpUwuPFXgvQRfO92gx5AAMZnwkUydHsDbzgZ50BBuhkAh01kBfZt+Ec6An8cxLfJysgfk44z6gKwJLkFLL9klx8E8aPSIZS+ZNaJ769gg3txl1hX3khu04y2b37U8/iFf4sBuqejxNnYkMupmySooNmAwsmGHI9cd/8h+lgpQMM4wplG2+scEeNKQdjCYknwgJqQEAX7AOxOgOTEWwmxqvGHX33denX2FsRdESw9DQChrDfQRByz7jV6MAJJFpe7JTceoNIJEpyUTb0rKHWbcl4sv+l59hT1q0Jh58NmmZJYVqltYLS+K5/0BUS5YiAUWPG7pNHdCUndy0U3IIkJFmNdWx2QL25zCxBwWbNZO2Eg+aH653rArgbsfsDuBu6HUkmqiSjgFZ6NNX7FYGf+EH5S/Enw5wA/vEIj0euBO/JLvQHawF4N3DaFlb8Yxr1brKgDgF1DcYaHurA4cErG7g5n6ZBAXp5foQ+m86tL6bRpZtl4RmwyLN+hkim1+cZsqpnlSsy9HPaURwEXtBs9DGdr0zS7pIMzpJNBkiY04AGQGnMCApAJkzcYIUaJqEH2ANgN0m8tBa5hSAkMuQXZ7scnA6VTN8i3PCGMXOiXsTXCBm+zYV1TlsBuDurOpE7UDL0BInTUoaDgHykqmBIOwQKYBH7YWwGm2TU2aFoYRu2R9O3Ed9UeDgb1JmLWbdqvPLfyOxApkjgV3wVOZiMYItfZPk/OTzqPm+1HVqdUnW6xrGnj88YAOPmHSvTH8fDvFBZ3KM5LkOEScpdteji3MXPHXvXatU5eB4Bm7SUaChx//C60wgavsRcW3LWTIYsgFo7UxdD0mbwO8L38E8CiiLB1NqizSZ3tLllkwzosneqfCRDGapf/Gf6J62eAH/B17hv8SXka/zPkf/5MvvNP36H0RJZelDPlORcBRiAdc2Hdi4WFt4JCQquxwmlIQEo2lm7chGDR0J+RYo2BYxH59PDeGaych4dfiMC+cCJPH4AnAZ6HeR33YkDFUZlDzpBhanz0ULlawxDonKArhBzhCo2Fp8McZR0ZlJUaNmLoW3DVA1GOa8pGUMP1jke1jejSTEgeR5ATCm3FKvnYsE6xRnFIfd0HuR7Ymfao0+Da5Tgs/TUufSc9lc167ucAGAI1RgNqis/afdZjQNyBOYZHH186GR9WKD1uVvmO2GyOm81ppkVeBA/7WBtEDDzcBuD41jG4uZaByaWp3HVfw5LpIneToNjgD4Bk+ePX5K3Nj7oT5I2RO2eRENxh3/CgfWHHpakTI49rIORzV02Cv3y8JNLlxKYaj1Jgi2Exa2pxRfxqdegniTfwE/tKmz+qmi3UN3MFNu5ZxPPBiLBex/10XRJIgSOFmvcuMlfs2gUs7bOk0BB1hxJrvVZ6hXtqRFia2HZauifcbV+xu44LHH+fXbORbi+VvLL7VbGL7gmWn9jRicrXnrD7DuS8q8LHceDjHbAezSt8sLNc70OoVF58031mxJxfab6BWgTZewbIEYGED2r2+xkRmb0Bu4D/Q9aaJzJ7tE2/wfKN+z5u4x78xF34OcI4Dvu4yf+OP3ewyzZu8GcXfy74/r2n+PTSdOh9P4GxdWqbm2ghGFKGz753AwvQpBlHoV7cUu2dqielCufK2nsvvNlNj5FrQGeO06gqDrItbzQKER0CuXvpT3zDsOg8cOSNvWFCLiQMlnIDJTzr0WxmZLAeFTM8spolAVUVtpgqYhEQ21laCR4sxhFMUfJgVTrbjyo0AD5Q7W0ahEEKWPFgrSrXjyrV4Gxn+YAm3bGPFrEPVSnyPLJyefJwAGMD70cjJjM9Eoe+yxuvwNkmgqiceRSxZCfMZAME8wXx4p9Q8LZCb+KPYW8EJgymJgGSCS+qSEczY7x2bG/7b2QW8iDwkjwpq3hpZQzLoQL0AWg0HiBegkR4eu2DyPWLygZiW0/S8BXYvVauoGMrugzIiCunYhRW9k5OVu62qpsgwFlnIOJd/kK9WlEzf4n3UmWqRsJLMuoAHrD6I8HtdjQYez2/MrgFefMf4lyuInteuQfOq8JHEkM4ihUNLDxbJbVlSSw12IvFu7kSdKqBqprAk6Y4tckUTCIAr2t9vc0BMxMeM8DkpkTOOuk+eI06Uahrqz4/ETiXo4UzwvPgnAQJepHtrVzdQrtiLXJDdjluhRJ6FqEszF6CO8ylCESa65OBVGYTc4OSb6V1+YsulG+c0R4DCyDHkPvGRd+5801QqLy+/lO1y/x/v25hi7WQX6GdwUgJ+D54lNv+UEo1d6WPdNwrzjhgP+IPBXfCgTimiNwAHdVFKOlKVkvdiCLiAcJrolSCZHNYSEM5Bbgo5hvlTgcgRAmlVZLP3qzS3I/v/JP4dtyVbs2TakKv+ohTprg+BeA1mOpTocFGOURY0oyrPnCjzSpaR8FnsouisTpeJkmf5gWfeWMrpz3usLHQr2AEpEWGX6KNDumtuWBvGS197xuVGGoCqpxZAzPvt1TnvRTWUlj1aZhXGegSx2GxBMHN7KaR6WBg9nN9/XtdOvxrah9/HwYUN2odNsYxOTGmaK8D9r3OXueQ7cPA3Wifn39dqz4uN4UTwRmIq5DTFX37MJBTaQ73t4HmlfhYI8tcuqmTZZzi8vVBae54dMW3c+pVoUzF8MbNdscWKtS9Oik8cwUD6Y9Fnqre4WEaysZatnc3G572Du9Jw5jYTdoe3QT1dlwdahpIkjicK1wAC10e0aoExcpoHx4k7733IDc0VQEHgGeZUpVo/ciNISfOaeATH6loGoOEOf9xJMP1WFYTEAIwrr1RaW4wnPfFee2Ojf4VgUEFlGtvnLfbX88TB3UJZQcfzzEwZfm8s8GMb5hEXzvlJk/FLDIB8mLFBK/SxMCV92Ubyv8iH2EzhMbhd52Pf6vYj8/bjzigR1Sp+cHiH6y5D5f8w+XcB4zJqjvRNjtkP6beqP5BozYwoOi01MZInIwibm5gHuzw+c7Ltc5ju4nZ/rc3+mfbrFq80a6cb3R0ujvdedl5DF9g9jt0aiknY+MXXqH16BJrKHFo9AagmC+6v1ESyecYIxaa3cwVg1Ln9xcVjKz6kyWMjLl8lA5fVPuWgPm71S6qNF9l4QwnsrkaEXNbpVLTLZUsEMotu2zb5+d1u2mxjVUYIRD1YLFTXgD6cgerTqqoyoVJ+4f7z7WOSjUTHy/K66wBMTW0c8YJlT6XqqCzNEnRG5xo4E5PJ1FjrTI8QX2pSW0DWx0QR0LdwQ+T3UidNPHzO4/FQPLzp7sAPmJT7j09EjflY7aJ15XsrEh2JbmN0F+E56btNO+HC6UUD2PTo18hp8QlIxCnuBz1iD9Yl/x2KlHPBHhojwdqkk78fDOujWTiEukUz69Uchdi/ZeGQXNye8VPLEubTHSmwj3F+dwJ0OpuXR37PVTKVvR8TLvmSZ3t1tlabtd8jYqGv1BNcVJ3AT9xNSO9tRFV5XMTdtFd+Nz+SkjxcgdX/Ia5h14UDn6WHNT63/E6Y6o21bbfQVX569ab3bPD09ns3YBS3g1kUk5j2SpUIqECzCjBc7KlcN9zuO8VXA30qC7V//b0kJtdoprzMBBaQWSNDhdoYOpP/K2suKWPRSDJy/91aZMw5EbQugCteoVJZ0TpSp8C1XDFqvyYW+b6K/6J0PYGyyV2AzFKoDGeFhjmIjHut6uPLduwV0zmDsNSaY2oq8DuRswzj/NO63kzlbjfh1wJjxwyxjOLKZ3iS72SGKREJWiJTyUpaUOlSAFFJigTOjpx53JlO6qSqNeRA6DPhWRjP5hcs4dHgiu+vqnK24n6WbNN+G40CF91a8imhNSZpoJsAjAni5QcpkFgalg1TqT4imYZbfnWcScoeotCdCWXinFTNahkIg48tJVm3oq1hGc+sAa8qBf0PCAHyG6yQUo7qFTvXaWLT1SPfW/piWrOYGjCsTqvfOUIce/ieiysdDapKusGm924RBfMtIYwKmpP2FStW3/s3DNBG+Kxc5N1uJ2B5z7Z3NRtAWZ4opnhSdn1ZEukLd2ETcqe3fDuvSBd+QD7SpCQxWHpntvY0UFxm9th3DBp6nGS5dvSMtpyCm2BGT9xb5oc6hVGLyXAiTqaK93QsdxzdAzOgKC0Sic2O2WouscNaPEs0BnxQxMRI4kLYYfbw9MM0qkvndC3wvZrZXzLD5mXZTyBpUsVKryx5KG4iVhBhy9yUp9zZLxvbjqTl/fNSs2p4YHz8k4tqoMBeQvx7PSBcj/diVe3ATA/STqBbNc+3q5nJTQylu80YOoodm4UgULGNgUQLRYBgseXFbaAkkDOth9s9HxbcDinihR2uaFT36Q7PYPojDTFuc7cuSY1UmE7xf1z+NUrv48XAT/yeeoik9TvMPGRS7dsSrTS4Xq3jFyS02d+6bdECbo5BFu/FmrodXKZi1UYOr2sADdXneow92gv3wqVjTpm1mJdWs2V5WHqmhr8JofBWF6rzXEidoN7dzKn90FPE+khViN3lnvhNUr2rml2TZySOpRJN6tptElmIVMUpPB8kpsl/Wx0/ooZyYVuK4Uf77XKpjrtXBnuQoHejfBQi0P1HwQmv1Yhv2u+NJX6iB/b07DeuVfcwgt3pwdGMD8m2Hlj8ke0AgUfe6d075a0OgLaehX6w8Ribet9LHSTkxVawX6ycu+P/ZWen8rbpCsTNHriTeXEs7pyABzDdZCQujPyhTEvW+nFtwC5Amuqe0O2/tK063IlHgmTLg4up7PPmUFV/yXjKdS3awpSkiQkjAcl60OM+QOMbMa76KxYaGcEg2SzXM5drqGmGr6nlA+XCGZEDV9+i0aBK8+3yEMUXAU/wapMFHplNlftHg6gE+zdgL0fANvKXs0fdB4aB51kpRQn0lTpGMWMNfy5St0/fADjTgUr7nwbZABTv+NlN5bc+bBonVy49w1y4nSe2DRUDl43wktMwMMuOwb9nuSPQdFMwQc6GMfAyaO1VOK0x1LL3MlsGjE+XqgiBlHqLpGsv42WpVOPsuzxuUJ+e8o3z1isgGoaC2t5PKDndmah3ejOZj5x2KE+tocMnAuXYaXgP+Qtun7CTZdgdv3QRzYEhVhxM0FTNl+yjWhDt2N8wEMz1J6jQK2V53mJGcTlwTi+HaHm3hCxDkwm+rgOubnlhimGvclZaUtW07xQsDIWAkYg5CEQL4TvfAHaaG1qgP5z8KAYyZWEhVv4ucv3TazLScvaivjxX6TexeZxnQlQeDFXDaFFke+kUuePhlhRl6HuVasIcRriL3LL0jyZI5I2v5FZQLg0hrgu20N4icNFTUS5cAy7Brf08ZVdBiKrdPI3dj+g/bFC3Y6yH14xTMlf14sThHiv2qRxPDA8XHiiIQE1xCvSd6Ie6hjFtNeNXOhRgDioBcQutDYFRg3NzgumargmA1uqsVNaIB7ZFcFGgSsE9TtMhAhtq60fATFkSdFTA5kewC5Gga4jEBaynF3/t0WWiGMxrFGc7ml2EKXu1MbFSQdac19ygWZ8k5EU36fzJbETKctlxk6mwv6cpFqgm/hXkR67oLDPLfQvMT814le8zIugxe7gmksNUMsaFyi0mcuhh3HNUPwjKyMwaAqdcVJ0N4B3tMclZCN4/2wGg1L8JMbJ0Coc1jWNIWA+Enmp/YPiqWFsxmFSDuI96DNX0pgwzwbmIQUnOhtowpieR53yxkDf6mgX/JyvKmyymm3fjHDMVjc7ThudoRimXJ8KdxLMO6Xz1jTCgIaFQqXZ7bjQ0lBus/oCNGJo1+Zqob7dEBd0QlQRROaMG+sucWEg2ykDbA8AOzrGtufhNsP68hI1EPUQTbXgbxeDlMPfy+ra9BQjS2eXNidS6C5XPsjB6tHRZelO7HITRexH/MO9+HCD9wHu3XuJzuw+t0ueoACtfClf8SdghG5ms9KJ3N3JMBREgDveClorLXenJWECdk1oeO5Rr4A3jzJTtUsmZRNbNKfd7mgdxgl+uudg7RPTI+xVEOHZldUs3fABB7FdPOE1OOemfWO43hc5Gvea8OequLHzJ7UnwEadCDG6xU5t7IyK+eehs59T3RgcKgtl61YhzcyFpZoPZxkl/m0vpiQRacQwu3Ucy87XobK3lmRf0Mias4kzzAdB/JUXCE/s7K44o6To6hmMUcZpf9FuNNRXaXChxJx3EhsyEgMMLirEkk4j5uyU3LrbXf2NGxT20V4xt9pgeYaKTRN98lIU9bkxh/ootXvcVEk4ZR256jsH2OCmFqE0R/mFFjuKHUCUV4RfepBS0PAmwDP2hC4VctMicUPkF15FFZhXKDEYQB6UQVbux0HqczHGS1YE5LVpn5bFtbtzuTYdZQ66ClRW+8gKK1uhSzv7T7RubZobk6y68gUah/dUgA/jzbuagJRVweKo8pkvcamtL0fCiRYMdRs4PZ9ZxIJaNuNvIx+5BcMcaCTNWYq9SK7jW7Sij1Efx41asB8k1j3CoXkkJUd+8301EdbFRXjcpAtL4AUfxG+QE30+RnSJgMRJlQOnY6V7m6TxkOdmK3gbF4ZzjLd98DtIC0Gkx9VbkVZKpp1RVVxXunYTYeqsdN7sqkO2slfKR7BA0fX1K4N1I8kr35n2ot7AXM2N0rkYRsh05fMLR0aS6n/3dozziMPNsUUiCYjFaMV27EssxQtLXFChCuJbnhURIh4rCZrnvDRtDEWuy5VReDsIoh/eTbpF0yRuyYZxrbmsFI+TfwhAVocvBjp/QWe8gpiPWI9dI58oRzlEgtHvdLSles+g5+1rJox/u7bY+SAJSBmIPu1rlKyXmUHog9r2Pbshi2QO4cT9TjG0W/j3hpCy5baqXAaTGipyx0hszhtUsah18AZ2PyHNMSwliC20pvVQW2x2wqEd49ajoB3bchncyGUgVjXOuoEJqUCna0QnqYm5Rg2MRBtAec7q07oIxt3bED3fKKtqieev3KLUfWNI3Y1XhNjYzOmxNK3qw6YB23JhEcxmN0XSvb5+Q6QGc934kz6QZlQ7ra+/MpbLsXAI8R27zwflzN05AzDXwMMfK2WHDKrLPS9KvxfFIVYso75c2lyeiZ8rXcD2kZOpDJu0N+vroZL1lbeeNzYFIjW+cOb0jQoqqj81Lsg9EDpzdXWqzY7Vs+uVLoxXvHgB1V5AK3R+KG4UCBLjjQEOQnEc0dd+N0xw+KZnxkjc6+fZ7EroKz66BRWKrTQKGrTd+MjZSQA5GpfO7FyzP5qMA/Dkq68Um7q+3hPr+57YLKY/dYTHnVHx1LJnyy30mhxlhlWvj0tvpLcpwYfofYwYHBn+F+ZDIoujsij0UeKBIY2bKhV9IgnSFdLw13W6UkYl4QFLkrbtLmHHdbafU7IdoTbnLkElG4g3ttCv9UHOanyO8Y4gvh7X58ZcOKT6TA6pom/sJpEQS7KVJXuac06lWj/m9z24pUdgGzfoGnj4mPgneLCHexow84EbwGwdxvf+eA/d3tm8Yg81OddjH3btsKfucaFy3Eh/LCVbdNmnk3fFlU4WNjyhUl9fj8VTM3SVc2FUGzie/uA5Rq7YCbkIi80Bwg/bwYgBkXcj5XMKJv/a3Wxcv7xqXJfLqAPpuxESezyx6Lv9NgjtgH19OjfKdbzZc/sO/Mt3HeQtdDbSY0D0S6E6jBq9DPmtphEjp6B8QD8HEQYb5Cq6Zpcqdrpun8kMb9AvDXdCpQ6Eu1JM6+IZF4Lnjog+UTwyc8ir22zBkLr1TVboCl7omgNFLWcLm5r/pBuJcATxvElWXes2EmwRUutEOsVo6kd37NyTu5VqL+jBbvTO9yJ3TNPl8zkexfelOtuq25Waxs5UYmfiJtwuZ7OZOL7AOgOjIsPLtGdI0isKf5JyDW+Xw/d46XePvlOSd5WUvEps72h/LuUa9+mGuneFY4RYXUCs7ks3bnQBs0IUbuAffeGez1yPfJ7hzfZ2v+P2RaGaLkS6rJ7rA1bVWHcHcXLkdisJ3ryKoWXXO0kZ77cDQ1kGGb8PZRXY/svRbNbfuW5izQgfWupEeGAw3k1L3UoN95lAvvfhXeWEvyD5tiGt48g0NSLGR2iBmawSZRZ4BqouILzsQUN7rnijIe3lhlHqpsJ23Gl7nSzTNOwj0bDkG3urnOph8rcQoxVRF/aAWkM3QERdCzEaYiHxJEFjrkLiYYiGXYXEdyEFdC6kTsYYdqKQ+D506R5nLvFViGGFC4m7CXpRLNZUhxUyBxMSz+Zg1jHCVSHxTd3d+Nr2Kv3NyotmBcPCB4232vOMIvFC68zXFOAoxvXWl/lCjrPuJhIus4Ye4pgKfnnltgUL52cddgfZJ+we4/Dd4M8JeqbvvbxuIP0cvXRhuU4Dt9foxStBGTC3ADqwG/fXaD/BszbQTQTncXqMa5RNbR150l0D8n/XPAHynqBlvrq8GNxZTbyoj5u56zF5iNoSPifKrqe4JgTzHkkx/H0l/k54/HOjaYCxsH/s4kpbncxmEzwSk7UZnnVXYbXcQGukaxMRZmNEMSB5G3ik0B7Lt8gJhOt/D7UjbqCMBLE5Jwlv1mFI48cil6c2AXcdQFXm6YAexH4WqqLQzU6U0cAjRSP/oqliLSOG/WP/FXB7Mzdo5DofcprwLmzYYQWmDcrHZHK2kpbdiCDJWWFeFQYjjEG4xBCGfDqBjnpC36cmFKgBTKlXmBdXF28GDjSK+crnCAxKuTaPjbmBmps3qAebvpvYZn+txxsW69l62LgTi/RHU1SuY3QD9FBCAVGNnhqDMN8p6mix/3Xsf7539fneNWTvRPc4HuzSkexCFLTRgrXXYXkEvI/HvULnKlKXWexlryzXhomRC5ar0TqzcXotLW4Lrs1/uSmM20g4N4yWNsXY4bTmBy38hjzX6G+RH+L5ehpJ1BgXWn+fb+O9bKOc6z7heoZTzLiFyDgEUjFaxSXM/9LChqW1bIHCxvVvLFEq/ROLtAtQoQHdyvzYdAtj03/ZbZZQZu2Wa01PasCXY1txZqGYGC5N4iHNzjqOgtYx2rm+Dl+huqAJ645TdQr2yoWxH9BarGwJtZW1d/kc2baj4Oc/LVrVRmbdGBcPqTitepi69RbsrIoecKp2h1iaq6IAsJejkFfqCaM7q1GcAOOHe7KilGu0FmDjtBcvGjxZoSpP4Km4cZ5IbMfNnd0hrly1r4xzkWITsVkUknfiXrXvgBq4E3FkTlbLYkGOCHuBrOLKtNmD6zN4eQ07LUdFTmv0BlmkQXI/53+/hZKALqOfAHhT8wAPZiDew55jUzilad4DF1ACVs6FqcgxaLPZ+wWpqKCaS65B6hth3O8pD6l2M09Qb6OgC/krY7T4+Xkuw/nhFvEjFoULIXruGzCTgA/2FRD93OZICQW8kORISq1X6sQxE8z9b8Tce9/YF8Xcf5nnY1fGJWGuj2UE+0oSUwTcaKK8Kzeil0kjQuTygI+MOiyYzYDQooEBuaxksbig6S2a8/xRnlhc6LdWPlMTWADshwAoe+FPsBfxN/ar6oVq+u/CvgXzkX0LVEwXY3hMJuiM4e2yhLb9Y9vWYQDxcB2aSTM3m9Ezp35AXfibUEaW0PsgMYF4ZZJF5aCMTgAlLbIsJwJilsrAmMgJNa2Nx9Z8PuScRE7OY4+F1SICtnl+oh307hTuqophw/b8MZCvMAAMb/IaVjsRsFogwJUL0KM89Lm2YTgxxzCt+cMcXhY0FsZ9QUyhyOGBij0FmPxfkBtROXVxjtoBkC27rC+qSJFUTGD2q8bLPwZi4sc08eE3lk5M2XQPRL5KUWa7SBYJciF6tSsk/gkin19M/AsSW4VEjWVnZGDB5bxxoWQq7xFdAAXFv3tct5fmcwJFTnfc7eeA3i/dJ8+UJ2HqUZDPWzcuybruGyCSAS8aYFFlaELfmj+qyPH5m09l08lCMZZ3bZPunIrNiQTZhggPga5haRD0lW2c9UK7AQ1LgRiJgI8E1FsuN/yXGBJlPvcqbETbzyHzDjTUbtg+EBeyyZnLGRVSkJMLxOBEvIMRdRebBWDq/011JsW0uujzn3Xe57/q5NzDaBJFbuCDEslBSfj3hJos25zP1dxy/mYnhAEQjxLnjJXlDeSHDS5VKUhZxQrzaIXdfmNJboV9qrsf0d4ymLi/4d9o4voTk+yuGffXhW2wvi+/lgJSQprgnz6RbyVMsOlCEpXN1lK0zExjJNjqQMI1tOc5u0ZJbjRYuxnlXimcTQ4onqwYSI5kTN5xMkuyMZFPeKfyOFLuGDsLLwQimOAj3wiC/sSNJo1Er6K11DSP/cs8mlgUWmssVOiaxO7nbAtvcHqFDCMuTDKYwneBPn3AIw1tN8jNGDlXp8KfKvIh4yKkMlqZdi44XtxSueEhAo393i3gi+AO0E5M30utWjZ31ttGN4GdSycgXTGFW/SzKvkOZDn/COHEdE4gPS1cPsL8j5TRBUVRUGVuzTIAIO8j3sh4Fiqfg9KwNHKL7vmb0Gl0G67tn7+iA77yjH7XeLQFWOJz5UBaxtuCIMgW56KaXvtDH1imVDlflT44uBkz9i/KHhWMIJRlPBUXB/rVS9ZVF6+4wVx/WYVdqu4vjHYlT9vNsemrOxrX7g6NDb/bct1BT5CfvDDo4XkKAI8nGnjSTgzlIIj+o2ZYdi9XXkOH0IZm6HsRWoPAMHJwo46dPWpeOj3jukSJivBcXfhMfnwoEkCM0STRhOEO61/BhmJISZjWHlrNZeoKZs/dr6ueRlyfLU2GlowHNBYGY2Q3jdp7i2uX9QJujaBep1hCGPSoGAXVSy72Ub4vetLmIafxqBL6d35o1iFaCDVlKhQXTQDGDiJrAYxJhYeB0p+6p5ehilrk6fCfuTTF8c1mnkmDOT0tJHKXFbNZgRW37SKy3nsyxgl6tlGoK1x2YhAH6cm9einw0BNAujk89MwYLAoPE9Y38LDR1cHi59ENLQtS8jZEBlQa+xLW5cfSgID2Q0OLpiNxx5WCgM6zKYSxITquBZkjMO1fP9elWarvcs/ekbvTh+kEtii15eWBtmXNOS+Jcjp0DBUnDTUtZkn3IMjaB+1AL7ey+2eovEerzQb9ls5fzKVmUNtydu2GsJW2xV0GHfJc2tfyjkmRy26I8kJ69aWWVQGA3Hh90V7gTvytGqP8jQh5DYasQmDYfL1voEuwrHQJEjgsZN1jGy80kMkK+ipQw5zZhq2CY1xB+MItnt3xg6S8Ic2XuQOZja8l7pPDRqcaX8/bncfnHRt9aiSPzzfgBz9vUAZ7bQM5e7rN0B4zPoIgweBZNci+NTzr8dv1DpM50o6xGf1Wz5s0m5bndbSzztut5++R0CqJMEhgDJJokE7oyJhCLk7FAuyhy3knYl44uvZ4lByJJNxVNwxipNZXsxnAQjH84k+Wu5/B0D9Erhw6B8ZlpmNF8mXjiVUTyxUmmtHN3N/Q9AKN8AXXkQiug1sMepKEB9LE9NodNYvXItQVVywzWl+/NhAYJ3J8cxDR/nHGzafexxhnFDYzZTKivJEHPGOFOlQBpKwEUYWb3Arfc9IES9lkyUA4SP1FcUHtqdPkVByJI1JDGR2iV71U8WGFjWggzMBCbpnbd3+nCEg9t2/YKAkq3jdXrgBT6qp8s1kPBYquazjq6qJ+L3Z/9Ut9skqHl4xxu1dHujdFRwmFtcEXhU6dWyqee5wiPcEOV4VXQZtjVGmKFmHoXt/dweP8SM5pvsM0qmIT4QAeZHyqKrrMyileWskyHelvZxpoisDN8z/W25y4dhpJznEZRgQCYhQxfELyLK/YvQuAwQE6wz7W2Whimv68C9Dq59jDy7TxBJ8/k9vvPXQg+meICbA3QsIfEWrN6Ac/HaJx0JuxvIb3se5OudmcY3EjZov1/G6I90IBYazMlA56E+2rlq83R6y2MeSTRFSJLOj1LH/5QZhPM+07S5pOA9cKczdePGsezppHQTi57a6M3Cdn7X1MSyDAJSCmjbZ/nB9hvG0N/V7gWUxW6J6iFww5zte5sVVDZnb+95zXK8O9hrJIFKbzs1mctxDbbK5uOvESc/rZrG05XMUF26tDui18oLhTlTCIfOPNR5/5pntEeVMQV8WdPyYzo1Tf26f7AUyY6TMrgA3S8lLYj4At8vESagC8gQ7DEMurNLxP4n6RGY9hxdcVKRdywqGJDLiJqrLEHU4krjf1I7ADTtRAhkQKCYFcuYV2xItuZayvx5oX2dFBeNDIiw5kfbroQ4DxCASE4eQ66KelljJ+Q/kY2++FdIGkneAeYXSqU+yV3nd+NW4prXySfrdns0/SpfYfde14RtyRtNmncM7P9n44t4zG2QKDQBkXIeect7CipFcBi0Ui7AbHPWTb8kiIruC4jxnTpBUDo8rLC9SjxEY/OdihRLlNZ/z+FaxK5YgVL2CwyLgSzO4xBJ6FF6eHwV/+mRzm17KBhSBS2umS6KUnrv4p557ovqTopSZnkQkTEmubUcm+h4aQ71RwgeVSFiRBty0QvBzr4kLcOL64sEB05Zb4XWiIHP+EBga3LNansQjJEXmirrDbUz0m+tKdsuSP0f47kdIKWkDDLJamwi9jJA5I0FRW9SuhOEoxXnQR1/gj4z5U193pGvehIulAANplTI489RO3yIV2QVcvq3La1mOkNgY9EgSpkxXubGLIKNEeeRTCJGKA1CbbQQ6iea9QjShNueUpJp6pquGS6Mi7k2sVtMjr3vTG8YhaEgkT3QQVgUi+WwkbTmD9wWpjg8mchWzLsJDtkoP/iTsNesZyNgiEoo+lqXp0iHTGI5/M6B0LJCHORMpzGjpZeQfMHdri4KbS+IOsbluG1S3dXBdaI+VAiV9MBG4hWEzwAk3wVixxZ1qSvd8xWkpGNEauInPD+gwkbmqekan7v2j36nML60CYwftHtPoDQfinqXnBMxNadB4HIHUDk4JE7mTSDgRbE8zb4gfq8lQf1kOlT6dTAAPQnbs2StCnPfA9zWaOuztPyuI+P5QtpQ9lAGEskGQvlWgZSLQMDL8YUC96fzX6Pt/gcQnNADKDHI9J5YyINpkw/4hd5VBsMlEsVNvCvsK6EaxUh4lkicyAvgBAbdCmvDmZ2Dl+421YMly+QiOMywsP7BF4T1H4eyLfBoaBvvJxy5epK2+WC8KPqueRLVKI3vMUhYGJYDbERpLLhHtEol6Z8scFZMgAjs7FjVxqf4ly9S0APp8B1n6hxsygUSLUpnaJUvCWqBwlyNBXxauHtN8oSj0+UpxWI1RG5yUeoSK0keBxVw6qR57w8yC8qum7BHwjK9QfmiJ2bJsqVNWiLo9U0NVkPctMhQ+0UfGnG18rzfPe4yr8lEvt8/t/ontMkJR4NMqxvvvcRF1As5kecedmdEx6xO5z+J0euSeT4VUcltDOIAX8SypClZdD2OBI+380eBTzhrK/PMyAvBiNooG4ti75DFqxwk3Tpr047A/6e5wLbCZuatjJ/CJPChEN0Bm/oQMWWq6Ih0xEGsKvlSR4CTiSPh4pwI9RTJeSijFocU27HUhEYJ6goxlOiYCp3PfEdSjc5zxJyxJyz057nod4b6CAdluY5OkFTYe4OjJZ5lc6mfOQp6U3of9Z5O07mPP2HWXuEYaAaWAzeEA8vp+PSz8JYEHAE+jsNFWRSYStirwYaFwHtBjHFCfVAU6Qrwe5MWP8Otoed5JDl0LUMVqIr9xQgzeZqOOy23OILBVrLq62RSqDyiP02IYu4tBXf/6KpWfcEVXQUJHw68HpyhCme6V3S0ppDJ9KoeCAARjcBumkuvIh9L2E4Kx4APMaoat6uEb54pEOCGA3jue7ANSIu78LAZGoo0zNEnutE2HA5WNPP+7rDJ/141v1yFHse57rQr8+r/BnH39GeBx5jT8D/LnCn3v8uZvIkCfIlpmYeTPJeSzBSyWByZKsFKgHP4FSUhDkFSxmEzj90S2PCIlOrBSCNJsCquBrCm7ycVYvf+FgzXgAC67P4u1WIP90u/USQV8qLdGHOEm1zyicH9xdi3UdReFkBRb/wgrxhjEe0EBlwH+SS6uqpbllzmlIDTHG2+rYperjpn1e28hrS1R1uxif8BoBizBd0I1rP1qhu7T8Su58O6pKx5a06+TYYoiRuOXVITw/+ddHENWVMlQfNU6OlBmD1AjphcaYNlvNx3VL58JBYAt4/TRsK16KAaK9zJq70v1O3dnG7svh6cZjbDRpTXkscADCa0TNUk78BalHbaEnk4VxxYTNwi7ZLHz+xj6GMksLV8n3iYzld4JPH8N5SxdlAjAdAWIB5fuwkBhSIuwhOhShgqDPOkxXYng7muU9KiJtOj063T3E4MIZK2wOZG3nu7BK8QnWlVD+tGgPIA5SHSKJ+JOWFPjl/UkdndUruDbKi5qJXfi+vs7p2Sn6x6VzL8lsmunk04b91BAo141mp+fGJ806ss2vYvjiRSjn6WmqijlxycEfzvQFzfTbb2xPWafsacuL3YlCiS8hZvz4jbVUxpbOiJjUtgAJL7rX45VabRu1ePB2212pPak+QQUf4P3QF5/Uy5bxsvkCXvzeQGbqw3Lsx9/FWxAnF4nXX6k9JXDGa+HrVv61ZqHGB6TilRcIH1K9cSChJECXboGg1GsktFOAi8SdZo23fuk4YVPY09HHJfYuOmJ92KUxaDq+JkfmVpAcKcZmioHjbhPH6o6BU0Re1LGQvL7hhVc+3voYl8timC9xpoHvTK2nlmNF0J5n4u9z8feF+FvblA818YCDik8gq8GIAYhaHd4nmGVLPmzLhyfy4al8eCYfnouHZy/Ew/NN+VCTDxLgcwnwuQT4XAJ8LgE+lwCfS4AvJMAXEuAL2dQXEvILCfmFhPxCQn4hIb+QkF9IyLXNTfVUU09qHDbVQGyqkdhUQ7GpxmJTDcbmc/Wk6qipOmqqDj3WerDFaGdMoC1MSV3M1Zb4uy3nTvz9+7NekyBrEmZNAq1JqDUJtibh1iTgmoRcl5DrEnJddqkue1SXg1aXY1aXQ1aXI1aXA1aX47Ulh2tLjtaWhLwlIW9JyFsS8paEvCUhb0nIWxLytoS8LSFvS8jbEvK2hLwtIW9LyNsS8raEvC0hP5GQn0jITyTkJxLyEwn5iYT8REJ+IiE/kZCfSMhPJeSnEvJTCfmphPxUQn4qIT+VkJ9KyE8l5KcS8jMJ+ZmE/ExCfiYhP5OQn0nIzyTkZxLys58hAPX/oQR/nxLgk6pDU15FereqcsVuVZ8KWs63QiAd/8eTikiSikiSikiSikiSikiSiuh/SMX/X0jF/1CI/xSFyBjnVf8mNZhIajCR1GAiqcGPuEM1elU9Qvqxph/r+nFLP27rxyfmY70CP1v6XVdcfaIfVfefVjf1Y00/1vXjln7c1o+ay5XATj9IUltTpLauGGiZ9lQ9PRNPGT9Hg5F/sZys/gRTXZMTUpddqssO/Q+/9R8kopp2/g939d9LO/XKf1F9UnlRVQzEZnWzIqiFeH+iH1Wums5Q0xlqiv8RcjssvOcmZ8Lr24T6VI80DRA1a1KuP9XwU01/qlW38H1b9wa+1026Vsf3J5q4wfctk9hpMqpr2apuY65nmg5CqW1dyzaMFPw817Rus/J/CoU0CCI2e1vNzzY0aru6pYjlZsUkmJsVk2huVp6pt+fVWuV5dVuR0YthEMEW5oUh39O8qDeOgx7McFEq1ruiHjt4ginDX0UcVU111fK6aufi9mfs6goqfJbnlXnrYvzyAPf8bCu//xVxt662DKH8QnBKF4Bp/T4lPRFJgb+kUp77touf5LwjD0AaKsEELN5L+OwoQgc917P+DN6eqbfnxgKqL97jcwumrjFtSz9u68cnJiqqx2f68bl+fCEeeUe/fcOOysUFU+QFvVuR9Fyk3XhAEFCRojAXV6QqIyxroiP2ITG12dGRS2o17nnfsYaJUpPJpHv/6iZILcbfL/zvXZ/CaSRSk4ZGppxZ4k/b6umJenqqnp6pp+f8KTP0QKoZ8V+GiFdoieb25j4IXuRnmo4UO5YoFUs8jnPkOi6Q61iT61iT61ijfKxRPtbkOtbYH2N3Fele0H5BBOSX2KQDc9lxrS6EEV+ZIBb2n1arLGQsyTl4cmHm50auzRziyFX5U6jDF65ugVq+C1uAa2C+/3whzKWLxZBrsbxjekRafH16Tpp9H9N+/8YOU+Pe6TQMktT5LczcNTQ5OUzV0QAdSOVuLGtzCH6MPLaF92i/6t2mMW+JP0bfCX5mgrqNgm85SFw1jnYF0gRobHdyRfgx1fs49RcUXDGjda5YGGmZG6XhS3uz44xzsPyk6438Y38ACYuhafv8tZL9uFypNtvn5+edr9NZhsGXRezmQgML4JiPDt2nhuuDsUtXXs3qyb7WCFR9Wfo6g6oSVurYpbXpOCut0XuJdWz7klmDoFCt3wvSQ5iywi1bfub8W4hehoceD2vol1LW7tjyPnmQD2ka6Ts67Dx5vKEMbCI3amJUUQfvhbKAGxdH+VbQaJ9I76YLhtRoibQfhCTy84DXjoYyRoIIclBquufV2T/sjYFtKx8U71JE2D++sQ+5i9LekfslLNnsdOKWPmDcmGM08qWDGRYfuRdoT348ccmAnA5fgu6KQE00N8HRwFmRSRQvwjauVee/NOaTTJsdDFq+cjqx53Nx04/Lytr/296796eNJAvD/++nkPVwctC4fcuM95yF1XgDzsWJYxziXB02FiCMYlkiSGATzHd/q6rvQti5zOzmfZ79TcZIrb5Ud1dXV1fXZX4yOw074uNiQ5tflNSctmitlEEofPCj+gIOnDBik35CuDW1XWQhOo+31cf0QV/G2o1z3Ly5qZak+ga2Wp+rRth0r9A+L8pdwITeAu8l8/EEkYUbNrPEm1OBfpAHfsgL8wBWmR/d3MwXPKkL1CULxxkSqdYoz/xEf+P6iWGfLzLUQwlRt5Q/qCUxXxhBfSLR72K1Xn4adfzST/BBW3bjJbtvwsrVdoIW1yoZqUFGzWkMW6y0ZZEwscRXfT7N0eAg2VzaNFAJfinRACKDWdIFPYYIlgFWLaLspRiQ4izLgdI0E9WH6sf6trY9E0vuKMIl9/QzO1BL7kBnE3uNaVOirPw2KNT2lqWmhzQENqpJItCiX05z/0llt8hyXa79qzECElbYZ2vtxy3/OfoP35/5RxH8Tvh6Nyxe4mLUIIqwK7HPDvBkWbYjYnlSzxx9p9Qjii1BWlquMh1LtGeBPQpoiJgTemSK73L1HZd7pSCvvfQ5KXiUSTyRTnQw838HqNEuFGpBm5yP5mbKFy7qJC99IiPFTH4ajdPrGa17dKC9DC0gltYCTXxokoxqGYdE6Q7nxEIfZDb9HAa9iyJaYVomaQa9oBsANHNF3+WSxBufAeflUpfvQOxFC3Ea9KVLJD4HOiMMvi4UqqWQkI1DIkqRnwvMJ95lxSKclbYMfUv6HtqwA4kCxuYFAgB/tOnvEtESJEvSOD/nfSGlTNEvONb60YLjzLFJDZy8EPAr3CyZZsvJ8B7q2pdkqmnrY7R6czFaIqoTw3Lj6n5QcH+2KYkR1z+uFUJxQZ61HTORq5iGpgN30yLl3r2tmlzjgqxrMxaCVBUUJEFl9053OkZLSp2VI8oqqPEb6r5L4m4MqLLliVvmZqQAxjArVewfImPJAPp5efpChGKoSjPvNWqcYi2iBbGhFByVwaUIvATKUBdaizhRmLQMzhYV0JgVgifgXts5LvVxQaAXWBEp4TTowHJFTzbSY57aFBYGlou0AxmXiys81j9rOn6QCSr7CYlsXmHPLSI7aPlXGPaqJ4htZcaZqkPBVDkUCLmfQcY5HxzZ6Nr2QpF6ExYMZZek48sgjr6EBh0JF6QeeiwnkcpYJLpnTjEFHQciliPyqOmOPO3YSXpKWvCw5xoCvgys6emLtYGqoQBeGPabAXDqfQtAG09EBkCv8g++JAKKP+jxD8JJW4iW11VXmCoZKEuhPlh5pYvL4PrYGlXSVbOyPg+uFQu79EVg7PaS0wS/MjOxMdFhun6PyAVSsuzcpli5H7HlxEUviHsNbk7FHcS4WpUOh6jYpQ0bkshTXmn93B4zhfKk8x6scyuEKlnfxjHxWcoc0mMBbGsZEKVQAqPDwNszoSPeo8/RU+11tFNXc0phTvD0MhkZBtLJ6ppQ79Tw7lKXbmH/HmnvG5EfkCqm2SSMacht9HmtMAYqIMwiSoA9zUu2SgqKRwRLBHAU2uFr1bUEYwOKKA/kIIIUGGlF+MRLpiP0ICiNZhJpoWsdi+wVgkyEDSM1rec9Im8M5ByUN8wBV1gBLAfwQzFGH5+Z2/Oq4U4kvLn2vEDRGpYL9NOrpFAEpnXBCao4fRjIuEwP+LDRRxNGsjMl7t+mWsKgLi8MmDlT2N3y7cUeVm+eTUbheNPMa1quRX7Jd9xc1iROSY6siPhFlFqeLmDG0tgi3KeF8YEvHdhKnuut5FCeHBokcRpX2JHaS45mpW4vlWLk5STGOIvEpFfDX1CFP5oaKVuQkkWXsJ4GM65yydMBsYWDEkoNzdgq8vzwhcCJKuyTtbWNWn5jBltZX2xx72O+tQ1b/lb1MkpugDB5G6S9PUF4P2S/kKeS/i8fuGFSfzS6vumPepfwJ7q59rbOI3a5onBVlPaqqry3XEHEHhX31X5LnLSOUHHc2saIV7pMvyC/tO5u0GM/nEa9cGMEcxRvULBmtxau4+eSL2KDRq3TmURNjD2hhT8wyKMWbgYZsZijyN1DxxYwN9W//dWridTepUvnCDjDTOLq/c3d3zyZhWz5NuXMYfxMgjrdkCWSdXfLXYcqLamB6ux6tJ4AQxMGpDyuFko36AsOHJ5MpomsqizGy5PZOKNUbCRnLkyXK4UWt+YLriHfIpQeGN7HSgJXlYmMJFmC14vgWVbKbUUT5P70Vp94KOJS61duSKX8JBC3PTgl1azO1W8HporTWQyJm/BxDAyuHkbAwFXk8O3PwbX1GQiT4jqLRuLcQDCSdoGBOtoPW6wnNsqB3xMng8tWmQSMI2TKBujoZ4Bufganv+Kf3zoowM5ULFEFhjyxwiiQzIx7xqh/0lTnkSROr4kaJBX2yqIGT8sCboSTkoAb+2UBN/JJScCN8aQs4Ma0LOBGNCkJuJFMSgJufC4LuHHeKgm4MWuVBNzotkr8tF61lgNuvJr9XxpwI5z8IQE3ogn3oZ2I3+mKgBuf7wq4MeMsA8ptcA92/4zwG/vCu3g+McNv7P+Lw2+MJz99+I3pivAbn//vCL8xlV7kV4ffUAjpK4T8twXkkODqtfYzBeR4+lMG5NgXATloqf8BATnKF+1/AnL8JyCHGZADOKWfMiDHePK9ATn0llmkQXK/579PY0lSv56iao7hG7IT37IcrOOpEawD2MCSYB2zVmmwjm6rLFjHVev/1WAdb+hgkFXYE3UweDL7/12wjmfUi6DC3s2WgnU8nv0/G6zjxezPD9bxYvYHBOvAOVoZrENM4OKdxssX8lz7nkdpqbC31rm2Uhas47AsWEc2KQnWMW2VBOu4bt0WrOOi9RXBOg5FsI7KHxysI5usDtaRTb4xWMfb7w/WQYPwVcE6DkWwjsqfH6wDB+enCNYxbfE+X7dWBOs4FGE4KrcG69C5/iXBOp5nFA6nwvKuucJetvzXKNl8OvPfkISz6z+zgnUc3Ras48gO1vGyZQfroLKLox8O1hF2l4J1HH1dsI6nq4J1HIlgHe+xs0ciWMfTGT7qYB1ht5531So6ymXcky7FPamwrLukf/qgxfVP2bjrP0edvqa4e466XNEn6QqFFEsrQ2lkpCNgUV3yZBrxs5XxsoHfw3E+czu2lpofyjshcfmEK7pwhQ8ZTvm9UAcvI+lmZRKHr8OknxpXQOgbOri5IemSLHtzA1xzbKqniZsij6HLTxHBnT6jH9ljaKM69DAAxSk5q+nxuzqK8i61JJQWghS9DrmLNXKj6hfrYokuKIW2dBvcLell0hG3hV2gZV0tS6fVR5fxRiK2F5DImGCcoTNIJTyeeZ7d3LTQnLpRStARynSNLjWyDeWJFsPV9XR9U6QYXHUuyoJuLAre3AwMuT2/9UzYlA1JhzT2Y6k4MeBugISmoHb0H1N8cztN1BUGyaNxevlKq67FzN3gutc4CxRi2xCX609CWYnAUZedZ/J7Zc6RaXHGRuL6wc4p7iDho1V9io0Skg6/CWIqVy+FKDWBGXJvfzTNqdSz0L0SOmZU3V1QtKzL0RgmqhSAaF10FZpGCYBYGzDz4kJX3rqKbH2FBKRz8igdvwnGGMS9mjO63TSr91RQhT50TC4IffuPBwH6jvO49c8PfaHUlHtK/+QUqEGHFLWAV0UPLVr/ZBuVNCUHT6yxvPcVN+damU53g84PWhvFuIy3bqrN2BWRt7DHTCuh2fXi9b6Zc4611XJxlooWUE9hzLQeCWbFuS2jl7bK09oO7PjA2Egnh9wjqfLQKV2Kk1IakEKqWYuejPpdb00Hpxceuh60hMK49NjJHduJYSmHbh5sQncfIhSpuGaKSwhb2qnH9+7FKtF8thwoov7+Ql236xtR9JUp8u2wtZ0FHcISFBpT0IOQuW1+4eWUgIlO8nQyc7phL0DXeA8MlRmnl07iPjn3yiYj3DedIJk5vSALuVPIkmrRwRd3rmd8/cXFazFy8LV0s2jsP3VINZTTKGNaGDlezam9pQSeVJBcS2GXSEWuhWdqxRlEwePuvzVCizknzONDyl1Qh9rrqeWnd7XaSriktsLvfpYKIG3BbOXllMKTUnXCnRTQtwwm2ZOoqGU+7vLr2ltdeiofnCwrhKvJzHA1y648daQR7atTzB6sPsNd+kIPfSgC1RiDzGtx3TqH2QAz4gphVnAcvZ4JxMjYavGeH8UZiEVii430iQxpq929aq7EVzteQddpddZttnF/fefmRkQiQd7QQC1xnZgvPK37qBWiTlG7XpzBDP/fa5kpeyHKbSJQiB5VlwVWQsS7QPQCCiF9qWr1y2TBR2Re8PNqDW9Ou0ehu5E58XITka6qzYsODgNkkhcWjrtYlGy3ts6j1kkQ4xJJFq5qr+vIM8x/ABiXH7L46C5zFoa6Vih12O0KgW20UFROqQqXR1pZVllFeQx7gczzShZUqBzQFtoEJlz3MEDFKM1DBcg/YBiV/OYmpT56ZGvBl+TCmErBYhqdPHUBESjGxadJlgP6bSB7S3d/bhBH58lGFsYD9SI/djj102zcIA6v0ZV/ZJpiLJskaesSyN9Nr32UGmqByFdkd5N04/729t9crRWqoeAfFovScwy5z5WuaRd+qB0jrkk1cS3iIN2cVSrjOhsfxKalrS2QIyEjsJIK3PXEDLGkwpJENdiAF/VMHzCTrjhgXpPNyKDCYuus/lHYhKWlR0jLGkljnlToV+9C2Z8TIDRREgnCDBB2jI8t8YJWSFJpXK9FrZ6u6/H21tZCoRZj1ObxPsa6j6ns4xMy4uxV2MDq40Ohz9Zq+df4e9Lix+a26PukW1Axe9iSph1ZMLXMI3Lh59xeddGS7i+3PtGuoEs+nmYdGaAxF5yHdSxM4XR8IrGiygPlxHRcHUWheWQV6dBaKmvyAyYWb2ooJPFwGqE+YEYswwO1ZFkJYwdCMavr/96V7G/PwzAYpfX1DYUmcuBP/vvpWpczGaoe6ifnLrqCu1guCJn6qxsT5yq+peVsrm5D6qnqhK1Jm7Ohp4dC0zGFgVLhmZ93lumBMmJBbMyXsRFjEAA+yhfLBognktWR1jtVSX5bLwnVCILIx8Teq2Sq1TI7q+xgWNPK/TNvQR2w1hQptIpjo/mmd3T+tGd9hMea+KDlP2EZAi8r+vN0NHSqy/2vDPHzjtAUljCzRNzJwx7MBJ8sexyhBUJkEnl5QblGQb9WNQFsKOnrauXN8MpptfRYs3BdjzsQlIEmKBNJUBpkZDuqsJ4iKD2dbS7loOkEs/UrbGjRnZEQ1x23/CdIZw5afiMnWxzE0AdwRs3YPqrH/vPm9J8bHQ9jQwXjjfNx0I8Akz+gimwVunYTh4P8ZhydD/Obbprn6SUqxn42SmKJILZLokLuh6tfbv7Lg9VlvvzCoHQFS6+h/u2eOXyokQubNCwdKJQAPYSsh+VZIeF8HPWxRDVNbtLB4KYKG6vIhHOHUD5vAX9wFfXzITAAwxD74JKC6YZMRF1K9QzpOhN8UC9RgqOzgUEDRL5CCmS2U7px2rswC9gJkN9I6GjhdDCxDDHNA1OI+tTy0I2d38jDS+hqjlaNK75sBDjPZgjho5ZpI2rWT1FjymtBw1t03Pz1JXppPLlMMm0UAmSA2y/2bxcXrxD/lsgO3H8YSrCdJQMvnuUinA3GaPTodkrlx+4/plF4hSvKVULkQgZx7Ica6na0rAEXrwxU7AfdmKEbrZjWAVohSHLAbYm5ovFA67zpuhRYd1Ul5Nq3VKU6cAs7K/OIW/Bb2gtub4zHxbt3byBdyRuS0oJO8+o2IjrU6mZQZqjD1Yhxv6X80jTq+Fd0run7v/d1/TxCol6DKTSpog9KhOdqSIT2fd5+3xar2Tz1yO+rlQEgwqKYwaBsVQWV8PZwuQjJZl9ePQxFISuqn73SPdb1t/5JadXTBxtfOutYVzBSVZFJqVx0o5ub4c0N7CdG2PGyzslu3QEzHmIKMHuCr6MRR7BekkttWrlC3G4vJwIdqZLbueu7VqtXXIWOPiSQwMIB/GLigbhakN1kI3wkuTY8KBmzpl5A5jayUQDYORfyQztdxsKG6kiMAMfbIHYeQxbnMJilk3zTeQXrQZbZdBmJQmoDLbk01Sl55ZxSlrZrfPqWpnmxO1vXU4wyKBdOp0b779KJkw1J9Hk1jvLQEblrDiKB050JCLJR2JPxQhAulQ2ruwMAjKCyAYg9DLIo2xil4n7QqxI8aG2N0b3pJZ1ieCAl1jXBQ4HtfR6PFqN0j53yap1H8Cm8DmAdhcw5o9odZG3OTPBRhiA+nlkDKAHf+meVBAk3Qtpww3mNjSqM0WV2I8QLXkUskxHATEHpeZ9oXcs+wWHP6BKF3BVhdTGU+iWekaTImVFsgQhB5lE1cBI2qIQA/qwEVj3IQKBSsjECZLqIRnLKo+TC9eSQKjl5SYEaNHNB0vKSj8D5XNQc5Lu0BJ3QYghj2sXgqb0h6qb1i+OJ67cniIBBOmgB056iBHDZpIsZXI0ABw910A0pl5e5dDNs1XTRbJmThDSfsxpTf6TYf5dnBI6NS5Ew/CufrbL2K/PRwgFMQyBk6OQQdhznZDwT81aZTylLDw4RfQf2JNS2yuQk1uC7pslix1o4vzu/OHMqyjPw45GzMOZ8cRd+CsRc6vLt/eHksqxTK/FNUxVj/kTrmUFgRCQiOHlhk4gzinTI3HWoFOPeACJNOWlTcXHChAj+LRRmYDOmsEW6cn7LEK4+JQcI8vCAt9zAKQ/I9GoCv3sWYYbaYEzimXOVji8yBNPapauc7faQaHdDhJdC0wABggPU0EFumu6IBJPM+0crBTmJACPo0OcwjsVHHuEGMlwGySSIoWUCs4+YA2SBwsnAwTCOelHuFBZBrYp9W9u+uZkK8aPupuqfXlnf30G3BB/1DGCj+lhgb3TmN7nTCSyEPsJmc/Dwq/ZSqocfVkoaoHH/0doHcXqlMKnPOacr//er209Os6/Iqo9MJRin2r67A7WhwXP3Qzjuu6sqqzn0/SvqXJsCpswKWKKB4mhCGFPElQ2F7qXddQCT0AdYBiueO4GC3QPOEg7Js1dPi9lJDkeUox6GBFCmiS31jh4yvE6q6Yq+qr04Lmkwjr+nRaiq0OSthwDYvw1wTk3OyL67noxxL4FZWSLuyNI73B2QsT+VCA90NLgC6KcIcmFkCqIglzbyz0KHfSDPDBLWxyIbMTzAw/YDHCcR2gtD9cxgu7nedI7CK/GMo0ph6s5I8TfLN4j8Bbmz7WxbnNwZJDDHzLXM0Mn9vlsdaq9DMyw9FffCAP1dJgFLXZYVXWFFwhDCuypebVavzO0R2du9bx0WybGdUfkz5M/OBoAzQ+wxsGhJgYmtXdk7MuzkBkf1Ha1SFbzdlQPtLUz8KAgZEXH3BXYMvW+HpQwxAJoltv6MxJcWXIvnLQ0XZxbwFlLgqCm1wNW5EUyDKEaeA+8IS3IVM+0V2Wo7A45ZlsN67w2/nmmulTeLg0gobMooZv7vsyLKGUgry5VB+V2weVzo3q1brJeh9UkagbdpDJWKbnRO8rk0EA5AdFXGFa9nygOQkzyB7sNGuiZ2WrcobyjczQrRV7VMAdNsp8O6eImkVZa6hqhKKA4WuMtbq1YiBmqjWL2SaXUtgVUJnyvvvwuD8c2gCKnDD0JD+GTAUtqekWlpVFcCfwcIZQ0NhJaw3ZfyepZnkMuyDsiTpCluklLJ1QIpug8qkUitVKoQhIiNCllEfGcXOoOGzsu2LCPPs9SOR95QdguZBbOH9ePWJt0sW02wAY9SzhXUVsndheaZLXoviMWll4vSkmf/qMwTEhYvzjp7RcXhnEJ6iwMwL9HEk3IV1e+XRMzJnSJmkiNzdyWJt/BsL1tl8Gk5sWdKnKsZC7BLifA4ly1rPWcEfFYGfOBp1UVLhilHqog23P2jpYMpR4Wlq5EnEcJftC5PymlwcjsNLlJIg/wKzEgK3mTlvPKKl0S69lfx6pWqg3IXUYlwEdUrah5pH3U93k3oRMp1vWlDQ4EYnc1gZmLUBWO6r1JXGoj8RjqOdPTQnj/nJRVr4dbWtplRG7wuSDMhsWTlsNh7kqrImVqgKoS81kDHvk+C3gWnAAlpFdziYE6MG5z8J73wJVrxoTcaFhQWgTwhKO8u8TIiS1LBS7os5VpMazHH3Zsb+VRVvsRMZY7Ujw2cYrfNEQzCEkcCraHu7wqwgcLYAxMWvQCaswW5sMEEtqSYhJZaeYDEmu7CprOWW8MSGu5LT3+lPjpt4VW4xGoRCyG9jN2qDvbdTUgdtFuKS/21vbXtmk0zyJekdROiFMm/YSyEo7WSfodLjAaXjXrfpP1W0ujXa/JJYWypKl8B7DJ9Pk44FLwLE1fKx1E7hAst1bqC3se+yK6Mc71yJ5Uyn4CY+0qdK3XqcTitciVn04pB2uTeu1cRRyX4Bujv3dEI+fq3P70ETsv8DGPAx55CoRNQ/LjKYYKNXdkRZCXwrNLhqKI6Rpp4WxGHN+PwGr6PC950xSnkZQhz2i+q3yf5OI0d0apzhRIJ0hHpb9o5g9EojsJsqQQcZ66GKZy5SOOCkRQE0lC/hIRMmToWZnDGSvytNCkAjkxhouaWmyOgj0RECz5g2q20VzK1BQSTW3nu1ZVK/OppQtHtHlp41GCaBJeL+tN3TH7EooW1nSh1M47BZYSdO3REx33ooxfRA88ztqXJLd45E9/WUpceX8gwpbw52kfQzCFCTb4VFXOFRF9XXY9OU1n97wnZxotTTeYbnzZQGx9eeZrSXM9oXzX8LUbahSfywObpcUlx3FIH8JSVjknZhfFOOXGXmv70Vi/NyAmuzEhvC+U8t0DG7yZNj1WBu4iTzln/WqKgjItsunDYspePUETdQtqg7h4KawwY2y3zaqLwuf7tlEPdWP0Q+cjo2nMYltIQTF9BR4K9xLxPqqXwDnt2GXlZLJMXTl1WeuYuaPUY9jhwHKonS8iE24ktvsY0JGM730rGTAT8YUImJrWcacCW7NkunkbNnDVR1+VmmEw3H7w6aR23Hz46ePuw/fFx+2DfrmhFJvsKEJozJxBN0Gq3UF69fIj2LupDravZlyqd52RoPaywS6WreWmodD6o4T8KRv7Meeg8ch47D5yG87TpLlgDYxbBh6Zz6Dx3njhHzr7Tco6dF07beemcOK+c184b563zznnvBE7X6Tl9J3QGzrkzdCLnE555nZHz2Rk7gNLOxJk6V861M3O+OAdQe1PUft/51fnN2XX+6vyP87/O35wHDafRcJoNZ7/hPGw4jxrO44bzpOEcAFQN51nDOWw4zxvOUcNpNZzjhvOi4bQbzsuGc9JwXjWc1w3nTcN523DeNZz3DSdoON2G02s42w2n33B2Gk7YcAYN57zhDBtO1HA+NZyLhhM3nMuGkzScFB6cUcP53HDGDSdrOHlD9Ph+40c77Uwazq8N57cGhmeDnm87O86zpvMFOuaYg2+P9wUcuQ6bznOckX0xZj/zOP0Jg2SiyB1DBYP0UAySnWPfaTedvzacacO5ajj/AyPRdE6azv82nL81nOuG86DpzGBEm06z6ew3nYdN51HTedx0XjUVILLpo6azC6PadI6bzguclkeiRRtSnCRzEv+kCev/6Sh9JefiMY3n66bzpum8bTrvmjiaT5rOexyEx2IQ9p1B0zlvOsOmEzWdT03nounETeey6SRNJ206o6bzuemMm07WdPK7J0A0/QiHPGg6B02n23R6TaffdEJs9olodoIvB+LlwPnSdLZlWVpg06Zz1XSuoRGsBPI+FWTvofMA3p6JkpeiDEcd3j3o/4Idyqrh+blsEz8ciXqgBLy1xKdrfDkWL09p/neazv2m82vT+Q3wh3Dxr03nf2AEms7fms6Dfer+vtPcd/b3ofALUfh/sKa2eHmIX16Kl0f7zuN9jCPXqP0G5NRtvnzpPAphPxiHDnrQBd7ClSr7U9oGLivsqrvkFWrWNTXAT7VXog6pT3e7/pxbuCo17lMXvWf4GH7FMmscE3tI0W+qwCWIjFB/7nGbFPQdIp+0rYss45ESBXfsFvpUTHqic10jv+XSdd2PFoa16YJps1AFr+va/qE5nJIX0GFxAOR1/6xamXe7luHywjszWl/3lT+mEHbdK72dduWu26ThPq+wB5aFRKPln3ehc/MBn6bao9ZCxy1jfJhrn6T/ky/C70k88adY7JUwrHgtDLmuu/6jVrXR8thF17TQGqNawzV2IcgzOQby/XRsOsuGjKGy3jzNO/WtmVDYioBfuxDe/8brruOuI99I/m5W2M4JjfpjpVGvw+DkMhTIeDno2nhl0DX+pc7hV579ZVAuHcpKW7YCwGYoEMajPn0RZjBWaQy8xTSIkrUrDcjGAfFlUCHVRV0t1ZYv18aWqymai6uoYDWXx5vYJtOC0x0d24icIsESYHDaBbS8RB844gHWaDTOJ0FsRRozzfzxmPypBUz4fOGiqeU4U37Fkk04g4RJv+gjguFhtTYXPkddl84LRjQXy5uAbr++dK2Q8/a0mrzw0sgRbo5HKe7MHw4Ai4JBBaAKXaWJOrjou27aMZgmDSIXupAptbe3XaAX27Fuu8wGPU9bHwBuvDIvsmCemTYWFg0touwozc3wWCLEk3aPd+8enDtzDLMYqaB4UdYa31UISqTjYjHpy2S5oAr1Zdj976jQZTzWkqwdKnpCUb20QHvNCkz54UP15sOHzKvMX7fsGJZAFWpnnoIoT9v2jR65TikgZKZXs3GbhA5R9Qe6RMPJIatRea8TddBGX72IJ3kHInqRs8yQEVt+6YOl24qMNIZSeUNRFj9o+Y6S11qP/q68PRpGMwIDTiPYneQ9i5wogFkn4ZSfRuuQSxNFPX6QFUkBSjM4iSDrwPvmvome29SbmtioY84+VSRtDFXNFI0FHaLqnYwGvDGGAQzzzLonkQE6xX65poPe5bW8DLlyjlwql3IHpKrHHF6t7INHESKnFCxF0hlkI4r+KQQfcXpWmXOTMNJVFj4UFmcdxWm4qAbrGi4pzOA6Lix3OxqVZgxC3VElwOLuC5UzBRyVNXIfwErXleVjiBNsLoIzjds96UtT3ARL35qkPCfTBASn8WTT9OvRWSzNEvfVJnuE46kM26y8kXEPLNAz8izJi16ZOFt605Dub8TEitlK0BemTYaiIhIgJGjhSm6IlsJeQN+kaxouWCLfNMX+sNzC5pyp3PILtlKSXEQ0lcO3BtW6jDGWtRnJC+U/6urqa+/x/oiLLhMIyyHEXF1Jfd2dn65aLrE/4y4sv/MujJwbPNAs9EvJQreIhZ5V2EPbgcPtzOdIBvWzHTYYTgCMD57ltSG0zNOtHLIweRRKsywC5Kh6chWdmi4GKLQSryfyOqK86UqCG2MrU+x2oXFPbcWaP1SW/v0QI8Gg73Dfvhfg21GuYonV5TqOgKdXKiZcrcBCqqRg+q8hJRGuYf+vgS048zB965wGLO0U+Ks+3VoktvMVWTXqCqAjnXp3HAYXJBnONIC53qAAYQpuNNZQiLzsLcRqGlBwbSkapelcQ9yuqzFHy/iHGhs/Smy8IHci3QprL/urfCLPa29afgvPaY+FA44X4vz2TpzXToqONx635iWBRSmol3ipL7lRQLbseTAqcSqyYiykN4fbxkG4dTA5fCvaG1RhhOitfnjzi7fF3THAVutJdxAmtTRA3hwG3LWNwOe9QiAxwQdgI0vd3eSxG4tB0v9Zc//b7wA3+m6ZGxWB0r3FCt8Um+chcap6Icu+vjCd0qjByJT7rJIwoYjdt308VV3rrLgEU1n5BcWqrxi7WgWxpgZLHOUwV23gT6QLPSM0q+WEqQRJikcnmiY1Sl5+mskwxYHgMyROBMhGi1CLDJgt3hfb5dVSbZotFS5AFKQs8up3jJYxsKtCuOKYFlwuFvzISYq6wQlYPfkdOHsZDtCmsMIjarbK+xG/cDS8jKVkW2LOv1RCM9LQHSHVKnsOm3eshGippoSBppFEJAPdcrKhieTOd/hTsRYjrh/vNk8ItBwMdkQOb1RQIExM3zUhm8sO1iKz+3lnYdzkLQeFXHZp8obLcsjhfb2tKfWJpNT7xDdcVdiBxTc8EzT5uEiDn7Xmxe6u803a1JkxXA6K69CI3Ahy/tFXV6HWGGSFMcCSyPnWi54/Cx3PvjIkXL1kgUlVYyDD/BgRyfMm72WE43agx+1YjluFxm1aYZ+tcXvb8i9w3CaTwri9lXEJre0iNPXp3D23Jp8HkzjeyHrjMEzcmhm5ELLgg/X9rIYbCybxlDOAeTLhscSBU63pL8B/fjYc2Uykp27qzHWFHVqdeS86Myh25j10Zmk7EME1Nb8nQy9z0B1ATrTTvcz4Y8dbfM2AqBGJktEk36B1OYTywHvLcclERni4LRO1SuN3Wz4JqRxoK89ZjUbaSMOhHhhDXTPzd+qHXcMjvvQaRIN9UWFH1mA/FYPdKw7201swR/R9RZfOitBuZMP0itCjZ8C8lAEAP9KA9yTgnwjwlxX2yAI8POGA5yecbRsVOxCefB3bpk0LqoVg8Sc8SqGtXIAba+L/bnqW/kaUgv093JiM4jTob3QneZ4maorpkyTC4iOO28ic67JMMHaP9NiN5Ngdk++5BxX2RY3dl25ptAQS30uSNzZhd8j54M3N2CAHoY+JtbHGBkzZuV+zSpJcC42KkiB2PVZSK2QYG/k9dhqycUeFeqGZb1bYE2vmX3WJkd9Etp697vrH5IX+xP8EPy/HBSwYn8xLfGCKjp7CftjxX9MVFm7lCBMGaUWFcDoc12ToXqMGQxAlJ5ufpHUEc75DUb2n2526YBSwds1ecpXlV91NCs6i/PyiMFF+fDnehOUhnIeJxA4KInggGA6bbFS3snNfslBLtdcTLQj8Fc53p/fJ1/w21/DlrSZKJe6+Iqbu9uhaRel2DLbdhgEwFWCWmEqDwvRgdupmh/w58oI1d8dlCey8NQBiUX9iiBjGAgveERZ8rLAXFhY8FhMf8YnvF5d/dPfEPy6d+HTcR4TdIGVE1O/hY4qfSf+fS2C+FjN47qXg9o8Fboi28d5Auv2Rc7WnZqRK8raDRH9b3/GMEMoFTPBqS7PS1/RDCpCMvrCSfnfqLww9JUlP3tJcPKywZ9ZcJHwOhsU5SIAE3+bTcC2HXhymV3jnloVVz1RGi0fDoMr9QRnJ+28PLoPz8ESGHdh8HvXGaZYO8qWseNlXizD3VjY9X7++jNGDan2oh4IftKCrz3RXh7KrT6mrrQp7b3U14129LHY1O5kXgoeT2FbGSVCyaT41VkT4Ei4U71iEuE4d6KGZyhYTvmJQLzJfX5WFfAbVuQKfyRnH/u+xlD4K+w/hrz1lyyJIXo0nPV2HRf+Y+P1DthUxvPZXdtOxxZBro6aAxxX2ewuPxdLM5ojiuii03hDvsURz163L5nvy5E2anQk7awYJd31ES9BRkRGcamUeLKSd/QANRbwzjAdtutvPMF5M/VLjgrK2RPc7zLJ4xJRO/b3GkUuJI/kV4shJhYVXJo4EHEfOizgSGMtBLAA5qPxymVyOenyucuEBGt27WotEedglK3P0i5qhp7+Im70CQifkXUF8oADL57qfQQJLQsRbUc+GnVOnHl6pjp7LjkbU0XaFja2OpiecBse8w7Nih2N7UUhNYUCQ0wQJcHqCBBh1XM29cfUSKR0tIS5BN2W42q7GAdoE0XOSijdKVWMiAhVoP+sk3F/h8kztCmQfdnNT/KCHzjpVpn6GW3nsmzFBxugjZM8dQmVf0Eo+dmsu3spEPXiE9WHllcDuqceayzcYF93jmtSirh23IWw2yEw63ImFPDsM+4BJvaCPRcm23dR65xUHcU+slIjRnsJWHYMHXhEaZoOhB0hB0vuTIAFUn00s/oNb67EiIOb4dOpjjfEzifEZYfxxhSUWxk8Exg84xneLGD84ma9kD+9iRyYnq/nQJS6E+y+bhuWMyKLeLYzD+ZjGwS7bqSe6613Z9ZS6flBhgdX1nuj6iHf9qtj10clccTnoweuEczili9tgTa4KgNKK7dQDDdiVBGxCgO1XWGwB1ucAPRiTI1s2LQLW/+Gt+cFYa0XQ5QmmkBEseT3KGPLK7DRmvaUvO+xXr36q9xeXBR12WvArCDUyy8reZXEhRWTsdToqgEr1dMD6HRyJBxJsYd8H6WibBMm4WZ4Ivy0vxZHxKM0f4a5IwjuZ6WCAiurt9KpJzT28hsNVxsV7i/q0sE9yP4z1WM/RVM5Rj+boc4UNrDka8jlqRHyOrotzNCzuFF89Q+XiP2U0CsULjhRMMn0K+1DW6fiNSE1wPdurNiJ7PIu+GHDcyvNYThJQ3F77wypL6NrrWk+F6SWhPtBzcS3nok9zUamwkTUXl3wuLopzcHk3t663p63CxbHgFm0tjSXJtrvB2VdkGcvooV9CzMy4kRwdyEQlKq3UIxOLixK+Tuax1hSldeojPXgXcvDOafAOK+zSRuQrTgXP+SA2i/KG8yUeTwmQ4XxiYyrqgQjn8/kKB6+u5925bwyv9L5h7BCoCSBw52sPq4Y3k6IwgxqxhBk794vCjOb3yCukeGjV/tDUAgUrbkexj51605Iu8AzIu9dcztNTAp/ymjhGwRFAT31TShy6NPXPK2xmTf1M7PlC4PiyuH5mPypw7N4mcEwMyasSmGGEXpK6GAz+aBQGYwxbCUMy0717KRH7mnp3VGFTq3dXArGvxG5a7N3VSs5mo4seVe/mb67K8RSLheNx2OdOz0tx1UZGOkCUVCkOQXcg1IMCw8GhZ6XAdOpTPYIP5Ai+pBFsVNiFNYJTQRKKIzctG7mSK3ti90hgQQwqiWa+k0oaAliLUnZNgQ9vSpDMph6VyyC72FA5jbcNHqy7mIjSwkKadqOv09JJDrNQSATIwsBI1ANgJyw1rdLt1mVyAQCZXIRBpgswOvULgxzI6W7SdD+qsAfWdF/z6Y7zwnRflx56fa32RW330ktiw1G3tZ7sFc+2qCRQ04lcFSTOtUIMhcvixKHn/94TaovqNIxpnrjuliddltZ5CNBqWjiwpYKAq/qgJU3Je0DDe6beADNd60RJjofTHgngqqKmdR8yXqNCJNQtD4OFfsPBX/mOl8F1iwfC9IcOhCmwX9x4tm54likemmMJIH9gOECxPDIXZF5qBjivUQ50/ENAxx77E4cDTWGgE+ZSl6tBz0ynbs6/jzfvsGHSAtwgl4SwlXfhkNPLdfIEVpVCBZUcAd8aXhOq1FzEB2pdBmAy1IU+fMjWq5V5i9RQNy/CWVY1YZDYdwME0fvwoVvdW/vwwYOn7Jfqnn/KOt4Zc6Nz16s/0As4lmGMW7SAP1XYQ2sBfxQ73gVfyB+LrNzF3TcIH6/KjuyC6Vra6b6HGeP6nEVu7KPkxnhedb3Ed0DizYwbnY+38mXF6wPAkI9FnktqlRrdYEZXO/WP38N7PdRz9VHyXm2aqy8VdmLN1UsxR8W99aUhdCg5J4Rlni3VuLjC0ba7NARLZ9E1IyQmjAm6xNHteLecT3E09dY6yXDDpHM4DNqJ0X+52exT/19V2IHV/2OBqw/4ODwsjsOD1dxZNhyjQ/c72bPjcvYsCc+D1YKmVYzZ8XcwZg8LjJkAnBXg6NQP9Lg9lONWoXF7XWGfrXFr8vFqFcerWVzbHKgzjFwlDoekNbniPGtuf+jaFKW0pPe1Id5rZh7pu0TmEe818UrhIZeuCA09catmC6kD3N6kzEitaP1lRByeifKU/hUIH6oow1brd0hi1qpbQNwj7cpC0pibmy2EpZh8x8ppaYywoGAuVrZRSBPzVki1htwqqNKsgirVnByrnEyyivHETv2zxs2W0nMi3HxSYYf2/sNx86SImx/LcdOBFTmCFYE+fON0vBH00QbALds67AyL+okeR+sTK6uwUz/UfThR6kPUhzcVdmT14aGgR8W982GZPE8TTNN+BXHQZkdzcVBe4n+Sr+F/hMzWjfOxu6TDx13hSgkqehgKDHMMeT8ATQWGJ+ccg2MbCVizR16FRCI5ghLfH443LzMVTLFEDHKLIuWti+Gh3pQx9EqUnG9cQm9gvowm/TkAV5sbV0wbeRcoTTzGX6ZumzbGePeUd/HXSI3HPBV+Fwz6XVLTOC6rqZuX1QSpWNOifmRQbLnTfyKMelxhjyyManGMahdXRWt5pw9X3UwDM4kei6sfMm+LuZUdt4THaRu0hZ9F+cmzU3+kgW1L9H9NwL6osFcWsF/EtnwitpniMji5m4X8Ur7tUmilUdC7+EZ+UVr8FDnGL18hv2v9GfK7VpGX1BZLhY526q1v5yJJ2wFOGt0wvyKtVGkZpb4E5CvSxajMaD7WncAJZ1F/ZdBpiZFvaJLfVdgTa5LbfHLfhIXJba+i04aiXL5efRNu5unz9AsgZHBK4+ndMaWa06CyR/SBF4UBfRMWERe9ok8wDp3ZFFogGMXxVXseSAenbp6OiInH0I1uR7kJDukjukqHr+Qf3e3I+4Az0WBlPl4QfySaPgP8PbOAoSzEQSl4RTRyHEgzIaIEPUIYJJOZ/UYDhMUTPV1vQjFdL2i6nlXYY5tV5tN1XCQgxyumy3LqLrRr9lC3Rt8viJiMAuEki+DVynJxTBX8gHcn/6gq27OqkkyI1TQc3408kg0x2sX1drxE12zorUQO7GUwPtehKEU+K5HnGwX9Pm47dkY7leeUjSheir9LkGXd8rN417yWqFEzbTxBMlmPNTYcSwr9jLDhbYW9s7DhgGMDd9ohb0Jr+ycMLz2fR1kW9inmae3zCTsPc7wEfRyMahWeQb4enrAoGYaw7cqU5ycLfpV5UMSzgx+4bl66zBz6vw9LLzMzt2DEUDnhamPPT8g2gc0xUy1lIp5KLWYUtqPWW/j7J9U5ulithewcuhLc3GQL1OIwpS89TwXwZn2/kabkLTtFF+TyJVYitEOoEGvK2DDImqLBERNtjMNsEue1BNr4fFLtMbp2rvbv3Rvd3GCEIVszizu5KPRVuLxIhcsL9HQxuqugjJsjysZGWSSjB4U7QhVFpVN/p9HrQKLXe0Kv9xX21kKvI45e+0UkOFrJw5tLmEdQ5Leht1+cblX5GrkRS+GGryhvo0rL8AYa5ayOjDdbuU/UYH+ZyxHxaG1yIFItelDIaafaFKGQtZBs0YRCw1aLhabsNoqVc7W8t3qu9uVchds4V08r7Kk1Vw0+V5+Lc9VYrZZn20pvuJ46fdPJOMhCmsDFqvNa4ar/rjvXRf1zyc21lLE91V39LLs6pq6GhyzfNrv6SBwti/zoo5O5DEZ7TFRG2i7NOdGp5Qs/FGbKdeGwdMnXZF4W2FbZwFWNqnJPm7wJ+duvfWWoabmcR2Ve1MiCeTfs9Sx/UCfjTWmxkP3a554oC9NE8pvqWZl7kKXDg2+zqszSL1h5tBinORCJL1vnEXBH9IwXAeHi1tOusrc1B0G6Q1mekNuEIjKcBa8+XVn7nXXcetY80Uy7mh1Yeksz1anbk0JXCsBkX//al9mRptpv75E1hzMiT6YnTOKjSWn88a16eofLPhxjsBkhAsy3tYhCsu8ZrYX8kCXWWoi2+RntE18TleLy/7RadKolAotb9Vij7a/VY13a4MlZ/gpV08HXqZoGEktZyuJ6wCN4ErOCYgv+GuVREMvXSYKXoHvV1A9Y7AdeDZ++Wk01tvPeoqbKRTG98mu3Xqmuak+su3TF3Vrvh27Aeh4rQMN6q3RVe3dozf4oJNxqtlwmwPFJXSudFgZpCdiOOFDKKmEFVwrC9KLy60pl2ESvrIrSCKWVNT5kgbWyvvAVdVhcUV/KdKCU9GwEGyWSgf6qbdNUdCELQ2D6R2nMNdVJ5HX7VYSsR3Hcezalr8m9Z1X1ygDLxahkGL4sCeEgDByLixbNJdRCahFggGDy1KUsgw2AJND6C8zToZ6nYiXMLYGtUw/0BB0qzViaoOiQxdYEveIT9FpoLD0vTtSrH9VYev3dGkvPDcY06F30YT42lD1OrLv4XCmWUheTQzawuvhECGdEF4+KXXzyo118851dXLECbFsOHbJkUT+yR8QMcdKpD/SIHCn1ThqR7JCNrBF5zEfkxQlUhJZ1gEcUuFocNfACXzwSc54PoaFz1JXpxvy6TW4eTO0bTGwZHdYoju/jlWu93KZl7cWJ4dSCUKGhO16II42qmbrjDaWaSR0PDtml1fGh2OjfCQlykfl9d7cwdrhddp/PxbDLimvfIp0t+mta0q/cXjYWNW7zxYVJ+1YJbV2zxH7CojVZCzImpvRzhaxWspZfI9VtawZx2ROVHh2mx69Tb//rpLuXGmvaSquTsCY9ZDMLa55xbHlUROxnxn2DDHFRsoJX6d2tGQFm0GL23j2cD0MLQbyiOs3yeYM8ua7Wz3hUSiqExuJM9/2RXDFT6nt8yK6svr/lff804aKsL0veI75bK5+j66eJYTeRsaCDKdo6ImHbbMerJ4D2aIu83VlSJ8eLOJ++cP0f1zMuefa3zrka1ukp39BZ1mHoaVAYApLJxBm0appMoI0GDgEAYmncx8iS4dh+WT6B21rjMMRXeoi/KKVQGuLJIbuwhvi9lD8SgThBv3boxK92vc2MJFoUtacnTAUWQDnjAWrd1MK2KZjM20VJ5LgtJJFR208n6IB4yW/G7RcVuHtdbwv5WSjAguP7119TmG6naKSqKLW7ERI4FEzZAYTxRm7xIzY5UsaQMQI6kPLBhR8Wzyc80HbPSlQhtdnAF4FRL/zfL8oDcMOpacUXHgiZmxMO7t2LbT9DfVJwi9rVuXAFKOSWft8MlpGhMHTo5208Gg39MfyyoXdzM+RxU/14b7gJfagNNznQdR543IrWfnMzoigaKFIYUAxPCtVR52GMn55U51J8ikLaLjnzWZacKhQIDBQQAztd8Npmfiav0KOkXzJoRix0duXTSRJHZwaQ9bXD4Rl0GkMd+zNJUrn2KhvZoTY45b2wG33o//7w1qjqpIhyce/eQB6SxfvaAH20CvNhHhAbW6H4LyoONkYsdzAYXTrJywKW66CIMnrd2tdCp7COT9OPgCKDpGtoWE/UigiUsCG7IgvnVyuk3EKsvgJCbaOU2bQPLxkvNPF7pVSkifgNDtkDi/glbX7+WPIL0P5zJa6W4dRt3JgUu74uDJMd67b+QHf5tezyQ+py75B9tLqc8S4/WfIP0F6p1JP1xmkcb/SGwBjQ4bHMjQSKVni+bjgMplFa4lTCVP/CWD576hxLdcOJu2aqMdLhwFIak9yJpTFG2UqYkCeGT4kS6NhSvzr1j3ocn8hxbNM4jg7ZiTWOQdu4t8Otjt/Spe2li7u4zYqb66S9vLm2ts1tdNC27vd6S7vqSOyqOgBDv20GYBAkS/hK2WEbOzI02dap+9+dD9kv+LO3de6RN/43S74A2j9qlLq2w9CVHUuVDzzY+ga0j8T+qE2q5Dc3MUsNJwxb1rXaFiNDd+Gi1/PsrDZpKO7ofe6XuH8rJZ6TQzzar3FaRmI3GS78fr1fsgVN2lWZc2kLam3LbWxI21iM2+ICeTY6t6B70oUUOMJUKY83cKJfC2Bzxuz37vWUW+RvuXfUbZ9xS5FqZS5rWjAHF5t3ZkJl3DX22vxuNDbvRrPlu1ECfeCnkJ1ubnu8Pu2HLm5XB/zulLRAVhF2zpN06id6rb2Ra+2A1lr/kB3bB2e+1h4vGeW2VyhXm/6dVutg/VIl9ZEb1CXxyCM+Z9eXKMnjggAAujJEoyxhqE5ygGPdnceyO5+pO8NDtm9155J358WSfWu7RINMXULZkoeN7CIabaA8xNa3JbIq5YdAu8uKGfJDEqiEJQ55XqyUeeiWWXntnfq+HosXciwe0VhcHrKGGgvUNnfwUNzL3XpDl5mjiX2tss3i6DLKa4fbiOVRH/Uinm8z1M+tvZuw3mQ8ntXO24z8IR5tLzQlrGxXxyTfntP9ig/LXRoiVPONsfdf0XqEf8YLVeRQFREj/zzIh5uXwTUk80c43pHIXJd5Lsoo6rj2bmKkeCi5uiJ3kw/H43RchelAry9o4xX1Q4ogEyTnoXPqro/XYTTX4VjtGS7mdUtWvcpxcf738c1N/nt4c5NwbX94ivjT2ADzSIGpVLfzPRddxp+6nmq5Gu1B4zW34xpFz9u6KPFL/tH2ZhfZSGTgmfwmIJbzZufw1DQW09WsKj9vmR5+DnTGL/z4pJdkEwOjsgmXU7WEYwWFbuaSZkK/80P2xRauTPznGDdn1vYfbaPtbNu/Rqd9V20eI2fa5mLbT9v+FvDARCpuONXgiml4z3pVtLC7as8tB6pcPPNsYjrbpFDukY7HqePmym5SpHi5srV7XcpLxURieLUv70rkF9T2NbMofk19t+gkeXY07mnh9Q19MQJZ7PBtzKpX+OwvbZ4Dnq8nlok+9Fi7BZNeZh9hnBQYqc3NTYOQWyJsx92b4/jUuFRN7nvJoiaS4SzS16nKL1wo+R/PEAy8SqK8YFRBXNyjOMUi3lb+y69/3V70w/OzpaAOaxiDwYrjsLWx96G/Xt2EP97e+ThQbtJQKiSsCPRzYUI4KOor+217m7uqcoo1/2DF938hKnZ8sKJ67M+P1L+j69WpprOz8NxVvrvN0daN1XN/1t5EGlLdZjABqPNgtE+qEzQncvT1N3QRiC3shZYvaIlYLmyKDHCIkU6pV7NL/u3rinJV02Lhnf/9utJCjbVY/P7/UHHyQ3l7BaTwSpoc1oIXuipWpVDm5qb6aXsTiFJ+gM6p/W22Bu9L06sROdycJNkwGuTVkgWFNS5Y2QIE0BaapuX+/XqugtkAY4JhA6Sn6340dev5+rqnUhFWaobCy+QWotFdvUFZ9HdPOz5eRFk76EcqahUAIG2ZinFepEaK+HzvXqRA4B3yctQgcuuW/kqQU07NXuU8H6l5cpdyKiulldRrxknQH3E0PLLMqWugLWWkQv8NllDqPdKwFSaee8WHk4lZtLZ6Sar8D5LzOFRe9I2BFX6fIYtKQiwsNKGDC6GrIVsvKiwoapl9X0KE/DYsyCUKLBYGyGZ0HL7ZWCSGVKeI+gXdrPrb7vZG7v0X0RfRCF5OiKzs1xU0x+y+DCfUYRH+SYD9CEi1BXud+tv1VK2Bjfv1FFAe92yAL0WbePhZ3+mg/0R4uN9hSQFh7t3LLIRDB+EFlJrHfrr+q3DkzgMSc131RBwwBSSxAYmEA6GwZ2LeI9DM6iIRXRGSURarZjbFPTpiPb5VL5YWqULSq3xTKXDgRaB1JUV2Asaom2y3uTVAqUfCnTxpowieRCgEEqdB+oAMeSsznpHgQpR/eeSbkAShZC4Yb+AmLTSYcrrayVcuD2CojaTRdTFlA44+CerRF5K5LaItb0/809NOpxAcwUtOEyP0PA17hg4MzCmyUIIRX8ijVnWEcgAMjsGECbt/Mpp7CTtehkliUMwAjwRB4skv4leyTpnhYJ5/uG2H4EMLu4TWXtqPpmoqPH3klEynmgW2tr2wOmB7q9d1UfgosdupGVvjdE+bCkkoT0vAvMqtoco2+bYMUEPNgk0vDhCRA85F3kdnowWCJZZKVnb3CtD6kXZKLLCgCMRpBAsiqhtcjX9aytUClEScFgs9JjoiYa43ugLy5CbyqBiK8tDGW8Kcci6Zy2g3o919YaCRQfr0/gr0zghgFwGV4boAROoiIHRSY2Dbk0HmhANKa9FmNLvZ6Q6sR/xrj/Ne4lMihzA7vU+57i/zEZjvvuIohb9XHlWuupbASZl4xf+CjS/2zwbj9LJamacL74y0J3Q8WDP3zrbMn6cyd4Kv3Co1g6GBZJgeR3wsfsJEIfjLTjO92usUU69sruNFh/UKs9izSUA1oOHl2NfzVJy6QEeskXEvKNicKRaz1pfUlS4Sxz25pmvumHY+F+isayzbxJ+2ZRSQM1l3FXdMlelGPnz4UEVfGPjRO2NrOzoMXHjldNuaTLNwXT+jtKNEGZh3qxhehMu8OJelKTE5EPEMhWc5BiI6nn0EtpqR9dt6J+jUHSZ2FiuftjpFWGiKdKlv8gc0Xv5pUb/SnlKK0wcHFpIEoyVCyTea0fLcxW+durWb+/Mc5dDiQMPwXFIThyPGE2vcdI/SavzgQqBaVE9Ug18dXow59EJljVoxwfwk25Ap4puEx2iVf1WV8OMff3cLLRczEdASgGXwNGS3VWSWdpdBkhCLobQBuyWfBdvyAKjyt8FvllhZ1aL+RQtlr6SzmjckSZsdsieWJO1aSM4uuORMC2NfbxvXUsUIXEAUWLXjVdEas1qhd491PE9E36KrqbdFOfkFitd48KH5iuhccP5dCnkGgBhBqljxOxwmX+ZQXW9Y4gPN58E48asrgr3JZDTkLkvbCKZBFKM+gVsaTsmwwlWhXBUAe6uCLaEFFZZRlVd+RTvPwq3HN1Wno37EhWo5vTGBl1uKOHFpWm3FuzZaJsmGYW4snvTY1MLijU2uXwvjCLOGCHRt7hc5/IczawYoFf5wSuNkwuCsWXuht4q4vjU9zl0b6oOXkWUkHuXWWxyLHwNwppCnU3+i19RbeTnyjtZU95C9sDVlt/maeimk0e+XvAsVBM2ll2BfM/moAXQZfQmpJ+MgyxVSiXgqd6Bjbxxlo42wf46mVrfgTXnsGZzUx8bqZO5tcJn4VFJyFTiCa1jU3xseapWqf6f+Qs/LexVOgubl6pA9s+blgZiPp0tejkoF/8vD8VXOELeq7uk/3c66e/Pfp//87876f3vVD9n6h/76hyuPzLsm47ha2fHQkpL7SHxa1NUnnej6M92zpyp6BPVsesjeWz1rto3QNR9FN8NB0QFMOdo12zKai2eGBo5UvBZNLgQTvL7jrRl3G+tuVbFBkTgtRVqK2RpU8X4MDhayygQqYIF6Xa4eGMj6EvfF5wVNirjbwq0P/V82URb+X3tbXj3dA9Y6EDWmePjjlXlCo4IF6/4Z8fp4FDvzagE5E9ze3HUV571udWk9wHu99WxhBKiB2QoH2unNOM2yjUFA9hPv9XSFAxnIYUqRyA5ZOLW827S5RnlLbL4nYsby4oydtJcj3SobA68eGtF+uUN3aWZAO5oIxFtiMrAyUrB5ZWVFn6Kdgymt9pyFHf9hm7zqKK12ayvFpvfg5NFNyc28K2x26TVXKu+lRURoY7OYSsq1EjmtO80awBEkKt+xizEOrc2wGI6UtPrWcs/gfFrWxoU4kGscsIafmfBizIupwolc4kREOHFxyMYWTrQFDoyLOND+BhygvdLGAb59fjcOLOrj5b5Snaqv9Napj3Vfx7KvGfX15SFLrL4ei74mxb4ef0VfuTXPhnHdaqE8t/XBSUoGxYg8bKlwp55osBMJ9oTAfnDIYgvsYOofRajPTnog6dT/MkNHDW0/wLi/+0JN+nPbb+J7NuDxf4/HPKBcpe3vY/ok550/GPM76kOg3Zj+vO0/x9+jtt/A30bb/4S/j9r+G/z91Pbf4e+Xtv8Wf1+1/af4+7rt51eoGtj2I/x90/Yz/H0M8ODvi7Y/wd93bb+Hv8/afh9/37b9c/x93/a7+PsUiBH+hrv+S/zNd/0m/o53/Rb+Rrt+G3+TXX8ff7Ndv4K/wa7/HH/TXb+Bv/Gu/wl/J7v+a/wd7Ppv8Le367/A39Gu/wx/+7v+e/wd7voh3uFf7vpj/D3f9TP8ne36Kd3t7/oT/L3a9Xv4O931+/h7veuf4+/Frt/F35e7/hR/HwD8+NsE+PH3467/EH8fAvz429r1D/D3ZNf/jL/tXf8V/h4DnPh7sOu/w9/9Xf8t/n7e9Z/ib2XXz6c4X7t+hL/PAU74rR+PN4cYPvqwrZ+fG89HxnMDnr/wx0f68ZN+/KIfX+nH1/rxiX58ox8f68cX+vGdfnymH9/qx/f68al+DHfVY64fx/ox0o+Jfsz0Y6AfU/0Y68eJfhzox55+HOnHvn4c6sdL/XiuH2f6sasfr/TjVD9e68cL/fhSPz7Qj039+FE/PtSPLf14Ao+TnD+3jedj4/nAeN43nj8bzxXj+dB4fr4rqNFARgNnjyJOR5dNEv35wuNBfjFsmS9Cz3dREzAcw6bE34UhgR+xUxksVp6zUYWzozZJaWQqHOyhv9Gqql0ezskQh/TrCMADvnuKj6KGdEzf9sW3RQ89vwCZ50I3fn9AKXTG98yd3PygropkjwRQYV9yfzwAJTWWFfMi0Exdxpj1Uv5Hke4bC62RsuV7+KW+CsSFGCbFcJDb4/mC8bFFZU7j0jtKnFB59kYxPOxKGmDkzmMRv6vnx9Knt6OUz+Yia+2sMu8hn+vg7w7wuyxJ87DWO72PUTAZOu8WHr0pdht+9GT1ZyIstGqWc0fVWKZ4WC0vBIx0PfAPxtyWNfDIebiu2a4nyl6K2THq8gq9uqNp7V0bm9/DfprQ1DAMnFBzAiTLqxK0TGKnmMFNwVEKoxcZNdQGfy025BCUxRN+INOSaSmH3MPgmJdwLgsuyAo49VN5VafTUUdapwf4JgFP8VaRI/NeNcelibcPmUr8e6r0Nqq5WLCYIzX7YThWB4A8r2bl1DcPNGQmk0gJVdTSExOUIGC87BGMOLDT0gt8VvgSyS/qzgDGOtuL5EVKLh5q2UayoHgES2GvVdzwrHbaYe4/gBUkTs2t4fr83K4+ihinH4Z+Hi4hHCYdyR3HjAdwp4uhf2j3MuKq6B/TKLzCml0vh5y0+ivtKmoIUPVKu4TnHodZGk+4wwyVP52W5Ff0A3KpKO9erh6FrzpgDzBqr67AiHsY+FYlyLVn5G9fHodhX7ALq7GI8WoxABDjDgpW4cfn6uY4nLBOMIWz/AKOlNM1UTF2DS/ZE5kJowPUqcNfCk0yIxfg02LBJSjW/C3NEccVPU0CI/lMlY+cGBFjvHRvU+xt5kXFwQ1IhJR6+kLobiyQdQa8TjEgZ//ACJCVeaK0Exdn9eg0hWEVxHxte7FYjSvRSlz51pmG1VAy1ZkMf5lSl2M6y/ZUZwYcHaLTAaID/iB3wPBBTXDVePNhazS/yjtL0cXCuM+NUAhohFBNPIIiYamnlp7hlErCamCZ9ILAwUZOIC0L7dwzNTa0PFjdUhfLrSjiCIIuyy0Wskc97FEMA9XjA9WTA9XrCCRFo5DFQslCos6CuqwpZzAAZg0p2c0NPHIFfbFo8BID0s4xzVtMkiUpS1H5N5huWrlsMWTBCwsXxOsQhbA0S01r9TzBxm9mKLeAC/0iFMyqwbbl5fhiylIx82nYYYkfnbq/uDDj/FegFsoGT3NKlfqCiqNK7t3L9uRumGg1F6+W3NwQTVpQaGEzvJiwW8IYpxGKIBHeudhukoUv/DVLRsHsFy07ZJCqKYtx00OkiNb9tB797m8DgH9P6gp1eTWwhxLG6ot/GBRX4S9qJfSktAWthrLBJlpfHnMGoac8mRdh4YVQ0poJtTuoMYaVwY1yTQXFlKtKfEUzvKYF9kirLUruEQYx1Shc3diBtbtg/fQqsdIpGa1AYy07eRRJfyokO2kesoGSnQx0tvmSV5bafBAGUHFYc3tZtlH8zCRDVTt1ozT7mAUDZ+evmzsoftKvv9qvv9mvu3iREwyCccTfOgsmIjTUyDoL69b+DvDGVjs/sOMmWVGEyNOJ0ipgywoFzDUunzAUivAEzaweC1C0TMrs8gAW9iC9dnZ2fkOwrUAPtblkHyHjxsUwv4w3zMqNvBvcYcufM5ZLbmWMKS182iCnNCYcQdL/2BuOqYOM3iY9Z2eX2oH09DJ0doBM65edX80XLIT3ReIRrZYD529/IyAvs0ly7tzfQRiHs9EwRFN5a+hF6p81MHibqDFMhY6KEiOM1LV6HoZcGYMy6BfIoV6kO0x0yMHzFVIgs50iXOrqAnYC5LcShGDX9lPAvsPEm+z1y9KosIGkUYKqZFnUk+Pwr8eN4q3vf6bsp58ycS3/n5n6/pkq7iymPsR/xvWPG9clW1viFoyNqOib7I/ZjMqaJu3Wf0/T5Fzj39Hyv6e7ZFD9b2uZrLz/da3jMpRBfoqtmt/+uGZ5XMECq4kMHX7I/i08RCHU4c8FFz93/FwwCU/PPxdQIl7rzwWUHdL2p4RNRNH9WWDDhn+ucVIeR34usHhk7J8Qo35ONBdhnn9K2Dgn+nNSB4ql/dOARoKoUbA8WvqDCVahNDk51/wWiVOXhJjptc7Cc/x5Hf0RgZU1SFp2VRyyYARbzzhIemGho/rDbUOmlZq/W97am4yzdKwFrwZb8/VS2ILgVYNVnJwV01HEI639+zPIkQ1w/g2rKspSioClBmKSRL20H250o35UBNX69mdJpa3go8WVbkUrNQD4gRHpKKdFfboC+XjIRuoKZGRcgchsM8r28JCdW1qmR7v+uxhdFMIcJ3lWa+wu/OoxejtqZx5LB34LtU4f7XLt0k+7/gS1Eb/s+j38fbXr9/F3OPXnql+NXSbvVmtfdoE/mvpnf3GcNleWdshPKP8+dj6cyWIfzhyuLOPkqdMQiYicDqDjIDrfhCpeZaFRAj9CqYtwhjf8H87QQTf0YvNTliZYG9a+aWYe9yB5EMXh5l+osgjwqQyAXoD/o9+xEF1yZZtl8GAuqKUbOpCxj/fTTiPohjGzOsgc4MVyRAJ16+nAqnDSfAi9z9M0zgiYg4EzSycOEO84njkYpgOHAUHgMDH4hOrFToQmeAA1OqscR/2wYQ0G1XUIRDJxLtMxNJXXIGGY57BItrbOo3w46W7CuXHLHBbr5f8ACP3L0CiVX0V5Ho6Xiv3lL2eG/d6uYb8nIrDB2sxTvKVU3pw2gYLHM8iJ95anKWUTuTsumfHFSs1Q1/1kF913ofOQVXp3a75Pfk5Q98ZQyJAuUG5uzJhwXF1Hfrx/czPmLmzPLMTMg/E5ui4WLTr9lLzZ0swEycxRMRTewbSZH61aICfOw+ZfmqgQj1M8LsUlmFJApAwohpMPg5xn5CBkTgCpsG84kxFkH+PVezz76okW6LcVGGAtz/G3YMZfzjxvca4pzP5YT9X+uLq5uSk0Z0g3YiwGml8ZI5qgCf9eNfTxgY19jOTtbHs1I+M2zolZbA3z7sm8Kuvf/fsw6w/G42C2GWX0y6u/uVkzmtnBZui9htiIHvVOx9rAHlCRYyJ3sDTeHKUjdCOK5qEhqWIoxFty1uc2h+ScTxIRk4aVLtEzJFUmirgimpI50nc2I6r6jrbCzbKcMLTlH2oaMFT14KOHar9pHK75FJFjQC55790TqbSWUPFwsDkO+3tmqkirXk619drZ6T/POutnW+cs8X+H77MwjtOramJ6pCUVQquiyynMD8IsgeNqkrk/j86BzoavkoskvUpewxdyWR5ulqazLA9y/Eq/LEym8Ax/DSeRUTWRKmPDKQu4pu5uVWtesjFL0AcZGoopqsQNuJjjeutPX7aOTK8zWqWU6+yk6N2W6+ykZLf6CWuX1IUFDBV4Yq7Ak0qvDXOxqo/jyXmU1Fxzcbu4+aJGioY8qs7RiUUtQXXUbBOfjc4qbd4WMNYPryPUCJ0DzUV1Nyb15IDCru2ghxmlUS0d7gbkyxVpakkeNJTFDMCssCgZpNVEG3n7yc3NfMESgsfnPzc3l5u9qz5xFlUce2/BpN/5UHNO48ViH9cpDQI654U30jgfTukxHASTGIPM7KpnTEcI/CpwP0CmPHqrejKsxhRDCz8Oq90pm4syNcz6ZldatO+yq6l/XK1K7unNro96jdyuXRa/LhR/LItPp+zxLruwangbIRM29UdhFZAa5vnxrv8yr06nEupN4BIuQwnjA9nIg0IjL2QjL6fsxS5rLjfy0mjkBTXyUjWC1S85WiV7411/mlc/zrDQM3qukH/lt/Q8m+Lze3quXiET2MVV+ZQnXGDCNSaEx5TQxIQHmJDzhNfIY34c4ELmCQGyoVmMVqo8IQswoecZbgIg2fBefe/eePPjxzB7nvYncbg3rqlRGaNHGoNguL1+spkHUXwVJX3AGdzpnGyYTuI+7dySiwOCCcjbn1Brm84JZ8FOREGn+fKlnYXBKxCPOEa+LICt2jkGpMRsI1qayIRiDTCPRi2HBzXNXdlAbfXTXrYlKuX3J4JPz3xX5nXZZMB9/ZrFXfZx6rtb8rpxEzV0XPYuZw+nsERYa+pvswFnr16GOesN2Ankd1l76lfHsHIBYarzc9u1cHVtLLyQcEaFLOP5LoC+9sytE9+BAqDjVjK4Ph6n1zPyyActAKrU8HHBhPdg7WaWVxSxsqZGg+ratoeunwBHsZvp1elRxrVaef1znhktHMTcn+CSqT1VK1+mN3nG8Fh9oGNZVst1Cp+02linkELtNBSFI/VhgZ0C2AzcPJ4ibvYGm2kXiBRQxjEcqnIRzSerwRSot0ekbQYHQBxLOK72hsE4gJ1jvA9EDHNmk24+DlHDF75Fcf8Q92J0Db4g7niSE2q0eEPjapDNkp4zFkrzIUwm2ZX2BgiPv7oIEongKgDc5SNdcMkHuDhBZbHNz5NwPHsp+OoHcVw9I4HBKakgupX5ZLBwO8AWwhAAObHqGHuWj0UyKQj7R9yhLWk0nnA9xh3yihicHwn73Jcn7w4fkusswMkHcuSqfMjwADHBICHQYgQ0BjUU66onSDHVLKhOyIeHXAPu7skhIyeaHT0DxswASvJxVxgATdNCmgNlqram6+uw3sg6Z1wVhhwwWgWnk988xuG6D+MEa7/JpTSC8xHL+msrd0+pdx3X8wq+hikde+sNOIeSoLIo7eTcTF5V2k37M+jowyl+R9k+nrSQUziBlLV3Of0BxhwATYgv8rQfsoT7tYMmRMVIpHaQIoUMFbZPP047Pufsyf9W7tke0uZA8GrRwqc5r27D/qS2s+opvL8z3udwJNHEY5NTDPYR+jastaZMSLtqc5QMZDVsmcHw4oKszZGI1tC/sGH9BLwMJxSQGap+r0kNvNmnkaVmN0VJb2/lp9ppB80loBNvzU5Inf+dhdfxVPzFs3/IHcDBqCJ1/Uq3wwnKdIzESR5BL6Iwq1fmZE1VLZ0nmNV3ua8mugcnvzwU66bqcsmhx9T3IRwM8WgfJn0oBxs4VGdgqB+hrAo4jL9s/bL2F+cXhzTguFfzv5ecQD/Bzt0bYhi/cJxv6cy/Q1ks3kxHM+6MqNrznPvbO79tAMub4Zp2nsIyfKkKb2L2QzhIJLi5U/xA2oqfH5zIZMyyJQGLso1kctmFXHfDpfJ+J1htWI3B14GFOkHoS+WWMbuMerBM0FHFlp17JXS7fwR0io25zIcYRXYLlmWY9Zzpr5vbm9tOd+b8A4AaRsAaQYH/DygT7HTvNgYA';

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        if (url.pathname === '/tailwind.js') {
            const bin = atob(TAILWIND_GZIP_B64);
            const bytes = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
            return new Response(bytes, {
                headers: {
                    'Content-Type': 'text/javascript; charset=utf-8',
                    'Content-Encoding': 'gzip',
                    'Cache-Control': 'public, max-age=31536000, immutable',
                    'Vary': 'Accept-Encoding'
                }
            });
        }

        if (url.pathname === '/api/icon') {
            return handleIconProxy(request, ctx);
        }

        if (url.pathname === '/') {
            return new Response(HTML_CONTENT, {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'no-cache, max-age=0, must-revalidate',
                    'Vary': 'Accept-Encoding'
                }
            });
        }

        if (url.pathname === '/api/login' && request.method === 'POST') {
            const RATE_LIMIT_PREFIX = '__limit__';
            const MAX_ATTEMPTS = 5;
            const LOCK_MS = 900 * 1000;
            try {
                const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
                const rateLimitKey = `${RATE_LIMIT_PREFIX}login_${clientIP}`;
                const kv = await env.CARD_ORDER.getWithMetadata(rateLimitKey, { type: 'text' });
                const attempts = parseInt(kv.value) || 0;
                const expiredAt = (kv.metadata && kv.metadata.expiredAt) || 0;

                if (attempts >= MAX_ATTEMPTS) {
                    const waitSec = Math.max(1, Math.ceil((expiredAt - Date.now()) / 1000));
                    return new Response(JSON.stringify({ valid: false, locked: true, remaining: 0, retryAfter: waitSec }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
                }

                const { password } = await request.json();
                if (password !== env.ADMIN_PASSWORD) {
                    const newAttempts = attempts + 1;
                    const newExpiredAt = Date.now() + LOCK_MS;
                    await env.CARD_ORDER.put(rateLimitKey, String(newAttempts), { expirationTtl: 900, metadata: { expiredAt: newExpiredAt } });
                    const remaining = Math.max(0, MAX_ATTEMPTS - newAttempts);
                    if (newAttempts >= MAX_ATTEMPTS) {
                        return new Response(JSON.stringify({ valid: false, locked: true, remaining: 0, retryAfter: Math.max(1, Math.ceil((newExpiredAt - Date.now()) / 1000)) }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
                    }
                    return new Response(JSON.stringify({ valid: false, remaining }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
                }
                await env.CARD_ORDER.delete(rateLimitKey);

                const currentTime = Math.floor(Date.now() / 1000);

                const accessTokenPayload = { 
                    iat: currentTime, 
                    exp: currentTime + 7200, 
                    role: 'admin',
                    type: 'access' 
                };
                const accessToken = await createJWT(accessTokenPayload, env.JWT_SECRET);
                
                const refreshTokenPayload = { 
                    iat: currentTime, 
                    exp: currentTime + 2592000, 
                    role: 'admin',
                    type: 'refresh' 
                };
                const refreshToken = await createJWT(refreshTokenPayload, env.JWT_SECRET);
                
                const response = new Response(JSON.stringify({ 
                    valid: true, 
                    token: `Bearer ${accessToken}` 
                }), { 
                    status: 200, 
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
                });
                
                response.headers.append('Set-Cookie', `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/api/refreshToken; Max-Age=2592000`);
                
                return response;
            } catch (e) {
                return new Response(JSON.stringify({ valid: false, error: 'Auth failed' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
            }
        }

        if (url.pathname === '/api/refreshToken' && request.method === 'POST') {
            try {
                const cookies = parseCookie(request.headers.get('Cookie'));
                const refreshToken = cookies.refreshToken;
                
                if (!refreshToken) {
                    return new Response(JSON.stringify({ error: 'Refresh token missing' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
                }
                
                const payload = await validateJWT(refreshToken, env.JWT_SECRET);
                const currentTime = Math.floor(Date.now() / 1000);

                if (!payload || payload.exp < currentTime) {
                    return new Response(JSON.stringify({ error: 'Refresh token expired' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
                }
                
                if (payload.type !== 'refresh') {
                    return new Response(JSON.stringify({ error: 'Invalid token type' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
                }
                
                const newAccessTokenPayload = { 
                    iat: currentTime, 
                    exp: currentTime + 7200, 
                    role: 'admin',
                    type: 'access'
                };
                const newAccessToken = await createJWT(newAccessTokenPayload, env.JWT_SECRET);

                const newRefreshTokenPayload = {
                    iat: currentTime,
                    exp: currentTime + 2592000,
                    role: 'admin',
                    type: 'refresh'
                };
                const newRefreshToken = await createJWT(newRefreshTokenPayload, env.JWT_SECRET);
                
                const response = new Response(JSON.stringify({ 
                    accessToken: `Bearer ${newAccessToken}` 
                }), { 
                    status: 200, 
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
                });

                response.headers.append('Set-Cookie', `refreshToken=${newRefreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/api/refreshToken; Max-Age=2592000`);

                return response;
            } catch (e) {
                return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
            }
        }

        if (url.pathname === '/api/validateToken') {
            const validation = await validateServerToken(request.headers.get('Authorization'), env);
            return new Response(JSON.stringify(validation.isValid ? { valid: true } : validation.response), {
                status: validation.status || 200, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        if (url.pathname === '/api/getLinks') {
            const authToken = request.headers.get('Authorization');
            const dataStr = await env.CARD_ORDER.get(DEFAULT_USER);

            if (dataStr) {
                const parsedData = JSON.parse(dataStr);
                const normalizedCategories = normalizeCategories(parsedData.categories || {});
                let isAuthorized = false;

                if (authToken) {
                    const validation = await validateServerToken(authToken, env);
                    if (validation.isValid) {
                        isAuthorized = true;
                    }
                }

                if (isAuthorized) {
                    return new Response(JSON.stringify(parsedData), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json'} });
                }

                const filteredCategories = {};
                for (const cat in normalizedCategories) {
                    const catData = normalizedCategories[cat];
                    if (!catData.isHidden && !catData.isPrivate) {
                        const publicLinks = (catData.links || []).filter(l => !l.isPrivate);
                        if (publicLinks.length > 0) {
                            filteredCategories[cat] = { ...catData, links: publicLinks };
                        }
                    }
                }
                return new Response(JSON.stringify({ categories: filteredCategories }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json'} });
            }
            return new Response(JSON.stringify({ categories: {} }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json'} });
        }

        if (url.pathname === '/api/saveData' && request.method === 'POST') {
            const validation = await validateServerToken(request.headers.get('Authorization'), env);
            if (!validation.isValid) return new Response(JSON.stringify(validation.response), { status: validation.status, headers: { ...corsHeaders, 'Content-Type': 'application/json'} });

            try {
                const { categories } = await request.json();
                
                const currentData = await env.CARD_ORDER.get(DEFAULT_USER);
                
                if (currentData) {
                    ctx.waitUntil(handleSmartBackup(env, currentData));
                }

                await env.CARD_ORDER.put(DEFAULT_USER, JSON.stringify({ categories }));
                
                return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json'} });
            } catch (e) {
                return new Response(JSON.stringify({ error: 'Bad Request' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json'} });
            }
        }

        if (url.pathname === '/api/backupData' && request.method === 'POST') {
            const validation = await validateServerToken(request.headers.get('Authorization'), env);
            if (!validation.isValid) return new Response(JSON.stringify(validation.response), { status: validation.status, headers: { ...corsHeaders, 'Content-Type': 'application/json'} });
            
            const sourceData = await env.CARD_ORDER.get(DEFAULT_USER);
            
            if(sourceData) {
                 const now = Date.now();
                 const date = new Date(now + 8 * 3600 * 1000);
                 const dateStr = date.toISOString().replace(/[:.]/g, '-');
                 await env.CARD_ORDER.put(`backup_${DEFAULT_USER}_${dateStr}`, sourceData, {
                     metadata: { timestamp: now }
                 });
                 
                 return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json'} });
            }
            return new Response(JSON.stringify({ success: false, error: 'User data not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json'} });
        }
        
        if (url.pathname === '/api/exportData' && request.method === 'POST') {
             const validation = await validateServerToken(request.headers.get('Authorization'), env);
             if (!validation.isValid) return new Response(JSON.stringify(validation.response), { status: validation.status, headers: { ...corsHeaders, 'Content-Type': 'application/json'} });
             
             const data = await env.CARD_ORDER.get(DEFAULT_USER);
             return new Response(data || '{}', { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json'} });
        }
        
        if (url.pathname === '/api/importData' && request.method === 'POST') {
             const validation = await validateServerToken(request.headers.get('Authorization'), env);
             if (!validation.isValid) return new Response(JSON.stringify(validation.response), { status: validation.status, headers: { ...corsHeaders, 'Content-Type': 'application/json'} });
              
             const body = await request.json();
             
             const cleanData = {
                 categories: body.categories || {}
             };
             
             await env.CARD_ORDER.put(DEFAULT_USER, JSON.stringify(cleanData));
             return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json'} });
        }

        return new Response('Not Found', { status: 404, headers: corsHeaders });
    }
};
