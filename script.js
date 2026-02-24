// 1. Minta izin notifikasi pas halaman dibuka
document.addEventListener('DOMContentLoaded', () => {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const timerInput = document.getElementById('timerInput');
    const unitInput = document.getElementById('unitInput');
    const taskList = document.getElementById('taskList');

    if (taskInput.value.trim() === '' || timerInput.value === '') {
        alert("Waduh, isi dulu dong tugas sama durasinya!");
        return;
    }

    const totalSeconds = parseInt(timerInput.value) * parseInt(unitInput.value);
    const li = document.createElement('li');
    
    li.innerHTML = `
        <div class="task-content">
            <input type="checkbox" class="task-check">
            <span class="task-text">${taskInput.value}</span>
        </div>
        <div class="task-control">
            <span class="timer-display"></span>
            <button class="btn-delete">Hapus</button>
        </div>
    `;

    const checkbox = li.querySelector('.task-check');
    const text = li.querySelector('.task-text');
    const timerDisplay = li.querySelector('.timer-display');
    const deleteBtn = li.querySelector('.btn-delete');

    deleteBtn.onclick = () => {
        if(confirm("Yakin mau hapus tugas ini?")) li.remove();
    };

    let activeInterval = null;

    checkbox.addEventListener('change', function() {
        if (this.checked) {
            text.classList.add('completed');
            activeInterval = startTimer(totalSeconds, timerDisplay, checkbox, text);
        } else {
            text.classList.remove('completed');
            timerDisplay.innerText = '';
            if (activeInterval) clearInterval(activeInterval);
        }
    });

    taskList.appendChild(li);
    taskInput.value = '';
    timerInput.value = '';
}

function startTimer(seconds, display, checkbox, text) {
    let timeLeft = seconds;
    
    const updateDisplay = (s) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        display.innerText = `⏳ ${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    updateDisplay(timeLeft);

    const countdown = setInterval(() => {
        timeLeft--;
        updateDisplay(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(countdown);
            
            // Reset Tampilan
            checkbox.checked = false;
            text.classList.remove('completed');
            display.innerText = '✅ Selesai!';
            
            // 2. Panggil fungsi Notifikasi Windows
            showNotification(text.innerText);
            
            setTimeout(() => { display.innerText = ''; }, 3000);
        }
    }, 1000);

    return countdown;
}

// 3. Fungsi untuk memicu Notifikasi Sistem
function showNotification(taskName) {
    if (Notification.permission === "granted") {
        new Notification("Waktu Habis! ⏰", {
            body: `Tugas "${taskName}" sudah selesai dan di-reset.`,
            icon: "https://cdn-icons-png.flaticon.com/512/190/190s411.png" // Icon opsional
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                showNotification(taskName);
            }
        });
    }
}