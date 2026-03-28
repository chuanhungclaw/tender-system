/* app.js - 銓宏國際 AI 標案系統核心邏輯 */

// 資料儲存鍵值
const STORAGE_KEYS = {
    TENDERS: 'chuanhung_tenders_v1',
    CLIENTS: 'chuanhung_clients_v1',
    SETTINGS: 'chuanhung_settings_v1'
};

// 標案狀態定義
const TENDER_STATUS = {
    PROPOSING: { text: '💡 提案中', class: 'status-pending' },
    NEGOTIATING: { text: '🤝 議價中', class: 'status-pending' },
    CONTRACTING: { text: '📝 簽約中', class: 'status-active' },
    IN_PROGRESS: { text: '🚧 進行中', class: 'status-active' },
    COMPLETED: { text: '✅ 已完成', class: 'status-active' },
    CANCELLED: { text: '❌ 已取消', class: 'status-pending' }
};

// 初始化資料
function initData() {
    if (!localStorage.getItem(STORAGE_KEYS.TENDERS)) {
        const sampleTenders = [
            {
                id: generateId('A'),
                name: '115 年全民運動會獎盃、獎牌、獎狀及吉祥物紀念品採購',
                client: '教育部體育署',
                contact: '王主任',
                sales_rep: 'Kevin',
                budget: 850000,
                duration: '60天',
                description: '全民運動會相關紀念品設計與製作',
                status: 'proposing',
                progress: 0,
                tasks: [],
                isClosed: false,
                createdDate: new Date().toISOString()
            },
            {
                id: generateId('B'),
                name: '桃園市議會 115 年紀念品採購案',
                client: '桃園市議會',
                contact: '李秘書',
                sales_rep: 'Betty',
                budget: 1200000,
                duration: '45天',
                description: '議會成立紀念品設計與製作',
                status: 'negotiating',
                progress: 30,
                tasks: [
                    { id: 1, title: '設計初稿', completed: true },
                    { id: 2, title: '客戶確認', completed: false },
                    { id: 3, title: '報價單製作', completed: false }
                ],
                isClosed: false,
                createdDate: new Date().toISOString()
            }
        ];
        localStorage.setItem(STORAGE_KEYS.TENDERS, JSON.stringify(sampleTenders));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.CLIENTS)) {
        const sampleClients = [
            { name: '教育部體育署', contacts: ['王主任', '張科長'] },
            { name: '桃園市議會', contacts: ['李秘書', '陳助理'] },
            { name: '新北市環保局', contacts: ['林局長', '吳科員'] }
        ];
        localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(sampleClients));
    }
    
    updateUI();
}

// 生成唯一 ID
function generateId(prefix) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
}

// 獲取所有標案
function getAllTenders() {
    const tenders = localStorage.getItem(STORAGE_KEYS.TENDERS);
    return tenders ? JSON.parse(tenders) : [];
}

// 獲取所有客戶
function getAllClients() {
    const clients = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return clients ? JSON.parse(clients) : [];
}

// 更新標案資料
function updateTenders(tenders) {
    localStorage.setItem(STORAGE_KEYS.TENDERS, JSON.stringify(tenders));
}

// 更新客戶資料
function updateClients(clients) {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
}

// 新增標案
function addTender(tenderData) {
    const tenders = getAllTenders();
    const newTender = {
        id: generateId('T'),
        ...tenderData,
        progress: 0,
        tasks: [],
        isClosed: false,
        createdDate: new Date().toISOString()
    };
    tenders.push(newTender);
    updateTenders(tenders);
    updateUI();
    return newTender;
}

// 更新標案
function updateTender(id, updates) {
    const tenders = getAllTenders();
    const index = tenders.findIndex(t => t.id === id);
    if (index !== -1) {
        tenders[index] = { ...tenders[index], ...updates };
        updateTenders(tenders);
        updateUI();
        return true;
    }
    return false;
}

// 刪除標案
function deleteTender(id) {
    const tenders = getAllTenders();
    const filtered = tenders.filter(t => t.id !== id);
    updateTenders(filtered);
    updateUI();
}

// 更新 UI
function updateUI() {
    updateStats();
    renderTenderList();
    updateStatusBar();
}

// 更新統計數據
function updateStats() {
    const tenders = getAllTenders();
    
    document.getElementById('total-tenders').textContent = tenders.length;
    
    const active = tenders.filter(t => 
        t.status === 'proposing' || 
        t.status === 'negotiating' || 
        t.status === 'contracting' || 
        t.status === 'in_progress'
    ).length;
    document.getElementById('active-tenders').textContent = active;
    
    const thisMonth = tenders.filter(t => {
        const created = new Date(t.createdDate);
        const now = new Date();
        return created.getMonth() === now.getMonth() && 
               created.getFullYear() === now.getFullYear();
    }).length;
    document.getElementById('monthly-tenders').textContent = thisMonth;
    
    const completed = tenders.filter(t => t.status === 'completed').length;
    const winRate = tenders.length > 0 ? Math.round((completed / tenders.length) * 100) : 0;
    document.getElementById('win-rate').textContent = `${winRate}%`;
}

// 渲染標案列表
function renderTenderList() {
    const tenders = getAllTenders();
    const container = document.getElementById('tender-list');
    
    if (tenders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>暫無標案資料</h3>
                <p>點擊「新增標案」開始建立</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = tenders.map(tender => `
        <div class="tender-item">
            <div class="tender-header">
                <h3 class="tender-title">${tender.name}</h3>
                <span class="tender-status ${TENDER_STATUS[tender.status.toUpperCase()].class}">
                    ${TENDER_STATUS[tender.name.toUpperCase()].text}
                </span>
            </div>
            <div class="tender-details">
                <p><i class="fas fa-building"></i> <strong>客戶：</strong>${tender.client}</p>
                <p><i class="fas fa-user"></i> <strong>聯絡人：</strong>${tender.contact}</p>
                <p><i class="fas fa-money-bill-wave"></i> <strong>預算：</strong>NT$${tender.budget.toLocaleString()}</p>
                <p><i class="fas fa-calendar-alt"></i> <strong>工期：</strong>${tender.duration}</p>
                <p><i class="fas fa-chart-line"></i> <strong>進度：</strong>
                    <span class="progress-bar">
                        <span class="progress-fill" style="width: ${tender.progress}%"></span>
                    </span>
                    ${tender.progress}%
                </p>
            </div>
            <div class="tender-actions">
                <button class="btn btn-primary" onclick="editTender('${tender.id}')">
                    <i class="fas fa-edit"></i> 編輯
                </button>
                <button class="btn btn-secondary" onclick="viewTender('${tender.id}')">
                    <i class="fas fa-eye"></i> 查看
                </button>
                <button class="btn btn-danger" onclick="deleteTender('${tender.id}')">
                    <i class="fas fa-trash"></i> 刪除
                </button>
            </div>
        </div>
    `).join('');
}

// 更新狀態欄
function updateStatusBar() {
    const lastUpdated = new Date().toLocaleString('zh-TW');
    document.getElementById('last-updated').textContent = `最後更新：${lastUpdated}`;
    
    const tenders = getAllTenders();
    const storageUsed = JSON.stringify(tenders).length;
    const storageStatus = storageUsed > 1000000 ? 
        `${(storageUsed / 1000000).toFixed(2)} MB` : 
        `${(storageUsed / 1000).toFixed(2)} KB`;
    document.getElementById('storage-status').textContent = `LocalStorage (${storageStatus})`;
}

// 新增標案表單
function addNewTender() {
    document.getElementById('tender-form').style.display = 'flex';
}

function hideForm() {
    document.getElementById('tender-form').style.display = 'none';
}

// 表單提交
document.getElementById('new-tender-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const tenderData = {
        name: document.getElementById('tender-name').value,
        client: document.getElementById('tender-client').value,
        budget: parseInt(document.getElementById('tender-budget').value),
        duration: '30天',
        description: '新標案',
        status: 'proposing'
    };
    
    addTender(tenderData);
    hideForm();
    
    // 清空表單
    this.reset();
});

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initData();
    
    // 每分鐘自動更新狀態
    setInterval(updateStatusBar, 60000);
});
