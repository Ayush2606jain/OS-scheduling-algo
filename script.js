// OS Scheduling Algorithms Simulator
class SchedulingSimulator {
    constructor() {
        this.processes = [];
        this.results = [];
        this.currentAlgorithm = 'fcfs';
        this.quantum = 2;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateAlgorithmInfo();
    }

    setupEventListeners() {
        // Algorithm selection
        document.getElementById('algorithm').addEventListener('change', (e) => {
            this.currentAlgorithm = e.target.value;
            this.updateAlgorithmInfo();
            this.toggleQuantumInput();
        });

        // Quantum input
        document.getElementById('quantum').addEventListener('change', (e) => {
            this.quantum = parseInt(e.target.value);
        });

        // Add process button
        document.getElementById('add-process').addEventListener('click', () => {
            this.addProcess();
        });

        // Calculate button
        document.getElementById('calculate').addEventListener('click', () => {
            this.calculateSchedule();
        });

        // Clear button
        document.getElementById('clear').addEventListener('click', () => {
            this.clearAll();
        });

        // Add sample data button
        document.getElementById('add-sample').addEventListener('click', () => {
            this.addSampleData();
        });

        // Enter key in form inputs
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.closest('.process-form')) {
                this.addProcess();
            }
        });
    }

    updateAlgorithmInfo() {
        const algorithmInfo = {
            fcfs: {
                name: 'First Come First Serve (FCFS)',
                description: 'Processes are executed in the order they arrive. Priority is not considered in FCFS scheduling. Simple but may lead to convoy effect where short processes wait behind long ones.'
            },
            sjf: {
                name: 'Shortest Job First (SJF)',
                description: 'Processes with the shortest burst time are executed first. Optimal for minimizing average waiting time but requires knowing burst times in advance.'
            },
            srtf: {
                name: 'Shortest Remaining Time First (SRTF)',
                description: 'Preemptive version of SJF. Process with shortest remaining time gets CPU. Most optimal for minimizing waiting time.'
            },
            rr: {
                name: 'Round Robin (RR)',
                description: 'Each process gets a fixed time slice (quantum). Fair scheduling that prevents starvation and provides good response time.'
            },
            priority: {
                name: 'Priority Scheduling',
                description: 'Processes are executed based on their priority. Higher priority processes are executed first. May cause starvation.'
            },
            multilevel: {
                name: 'Multilevel Queue',
                description: 'Processes are divided into different priority queues. Higher priority queues are served first, with aging to prevent starvation.'
            }
        };

        const info = algorithmInfo[this.currentAlgorithm];
        document.getElementById('algorithm-name').textContent = info.name;
        document.getElementById('algorithm-description').textContent = info.description;
    }

    toggleQuantumInput() {
        const quantumGroup = document.getElementById('quantum-group');
        const priorityGroup = document.getElementById('priority-group');
        
        // Show quantum only for RR
        if (this.currentAlgorithm === 'rr') {
            quantumGroup.style.display = 'block';
        } else {
            quantumGroup.style.display = 'none';
        }
        
        // Show priority only for Priority and Multilevel Queue
        if (this.currentAlgorithm === 'priority' || this.currentAlgorithm === 'multilevel') {
            priorityGroup.style.display = 'block';
        } else {
            priorityGroup.style.display = 'none';
        }
    }

    addProcess() {
        const processId = document.getElementById('process-id').value.trim();
        const arrivalTime = parseInt(document.getElementById('arrival-time').value);
        const burstTime = parseInt(document.getElementById('burst-time').value);
        let priority = 1;
        if (this.currentAlgorithm === 'priority' || this.currentAlgorithm === 'multilevel') {
            priority = parseInt(document.getElementById('priority').value);
        }

        if (!processId || burstTime <= 0) {
            this.showMessage('Please enter valid process details', 'error');
            return;
        }

        if (this.processes.some(p => p.id === processId)) {
            this.showMessage('Process ID already exists', 'error');
            return;
        }

        const process = {
            id: processId,
            arrivalTime: arrivalTime,
            burstTime: burstTime,
            priority: priority,
            remainingTime: burstTime,
            startTime: -1,
            completionTime: 0,
            turnaroundTime: 0,
            waitingTime: 0,
            responseTime: 0
        };

        this.processes.push(process);
        this.updateProcessTable();
        this.clearForm();
        this.showMessage(`Process ${processId} added successfully`, 'success');
    }

    clearForm() {
        document.getElementById('process-id').value = '';
        document.getElementById('arrival-time').value = '0';
        document.getElementById('burst-time').value = '1';
        document.getElementById('priority').value = '1';
        document.getElementById('process-id').focus();
    }

    updateProcessTable() {
        const tbody = document.getElementById('process-tbody');
        tbody.innerHTML = '';

        this.processes.forEach((process, index) => {
            const row = document.createElement('tr');
            let priorityDisplay = 'N/A';
            if (this.currentAlgorithm === 'priority' || this.currentAlgorithm === 'multilevel') {
                priorityDisplay = process.priority;
            }
            row.innerHTML = `
                <td>${process.id}</td>
                <td>${process.arrivalTime}</td>
                <td>${process.burstTime}</td>
                <td>${priorityDisplay}</td>
                <td>
                    <button class="btn btn-danger" onclick="simulator.removeProcess(${index})" style="padding: 5px 10px; font-size: 0.8rem;">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    removeProcess(index) {
        this.processes.splice(index, 1);
        this.updateProcessTable();
        this.showMessage('Process removed successfully', 'info');
    }

    addSampleData() {
        const sampleProcesses = [
            { id: 'P1', arrivalTime: 0, burstTime: 4, priority: 2 },
            { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
            { id: 'P3', arrivalTime: 2, burstTime: 1, priority: 3 },
            { id: 'P4', arrivalTime: 3, burstTime: 5, priority: 2 },
            { id: 'P5', arrivalTime: 4, burstTime: 2, priority: 1 }
        ];

        this.processes = sampleProcesses.map(p => ({
            ...p,
            remainingTime: p.burstTime,
            startTime: -1,
            completionTime: 0,
            turnaroundTime: 0,
            waitingTime: 0,
            responseTime: 0
        }));

        this.updateProcessTable();
        this.showMessage('Sample data added successfully', 'success');
    }

    clearAll() {
        this.processes = [];
        this.results = [];
        this.updateProcessTable();
        this.hideResults();
        this.showMessage('All data cleared', 'info');
    }

    calculateSchedule() {
        if (this.processes.length === 0) {
            this.showMessage('Please add at least one process', 'error');
            return;
        }

        // Reset process states
        this.processes.forEach(p => {
            p.remainingTime = p.burstTime;
            p.startTime = -1;
            p.completionTime = 0;
            p.turnaroundTime = 0;
            p.waitingTime = 0;
            p.responseTime = 0;
        });

        let schedule = [];
        let currentTime = 0;
        let completedProcesses = 0;
        const totalProcesses = this.processes.length;

        switch (this.currentAlgorithm) {
            case 'fcfs':
                schedule = this.firstComeFirstServe();
                break;
            case 'sjf':
                schedule = this.shortestJobFirst();
                break;
            case 'srtf':
                schedule = this.shortestRemainingTimeFirst();
                break;
            case 'rr':
                schedule = this.roundRobin();
                break;
            case 'priority':
                schedule = this.priorityScheduling();
                break;
            case 'multilevel':
                schedule = this.multilevelQueue();
                break;
        }

        this.results = this.calculateMetrics(schedule);
        this.displayResults();
        this.generateGanttChart(schedule);
        this.calculatePerformanceMetrics();
    }

    firstComeFirstServe() {
        const sortedProcesses = [...this.processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
        const schedule = [];
        let currentTime = 0;

        sortedProcesses.forEach(process => {
            if (currentTime < process.arrivalTime) {
                currentTime = process.arrivalTime;
            }

            if (process.startTime === -1) {
                process.startTime = currentTime;
            }

            schedule.push({
                processId: process.id,
                startTime: currentTime,
                endTime: currentTime + process.burstTime,
                duration: process.burstTime
            });

            currentTime += process.burstTime;
        });

        return schedule;
    }

    shortestJobFirst() {
        const schedule = [];
        let currentTime = 0;
        const remainingProcesses = [...this.processes];

        while (remainingProcesses.length > 0) {
            const availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
            
            if (availableProcesses.length === 0) {
                currentTime++;
                continue;
            }

            const nextProcess = availableProcesses.reduce((min, p) => 
                p.burstTime < min.burstTime ? p : min
            );

            if (nextProcess.startTime === -1) {
                nextProcess.startTime = currentTime;
            }

            schedule.push({
                processId: nextProcess.id,
                startTime: currentTime,
                endTime: currentTime + nextProcess.burstTime,
                duration: nextProcess.burstTime
            });

            currentTime += nextProcess.burstTime;
            remainingProcesses.splice(remainingProcesses.indexOf(nextProcess), 1);
        }

        return schedule;
    }

    shortestRemainingTimeFirst() {
        const schedule = [];
        let currentTime = 0;
        const remainingProcesses = [...this.processes];

        while (remainingProcesses.length > 0) {
            const availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
            
            if (availableProcesses.length === 0) {
                currentTime++;
                continue;
            }

            const nextProcess = availableProcesses.reduce((min, p) => 
                p.remainingTime < min.remainingTime ? p : min
            );

            if (nextProcess.startTime === -1) {
                nextProcess.startTime = currentTime;
            }

            // Check if a shorter process arrives
            const timeUntilNextArrival = Math.min(...remainingProcesses
                .filter(p => p.arrivalTime > currentTime)
                .map(p => p.arrivalTime - currentTime), Infinity);

            const executionTime = Math.min(nextProcess.remainingTime, timeUntilNextArrival);

            schedule.push({
                processId: nextProcess.id,
                startTime: currentTime,
                endTime: currentTime + executionTime,
                duration: executionTime
            });

            nextProcess.remainingTime -= executionTime;
            currentTime += executionTime;

            if (nextProcess.remainingTime === 0) {
                remainingProcesses.splice(remainingProcesses.indexOf(nextProcess), 1);
            }
        }

        return schedule;
    }

    roundRobin() {
        const schedule = [];
        let currentTime = 0;
        const remainingProcesses = [...this.processes];
        const queue = [];

        // Initialize queue with processes that have arrived
        remainingProcesses.forEach(p => {
            if (p.arrivalTime <= currentTime) {
                queue.push(p);
            }
        });

        while (remainingProcesses.length > 0 || queue.length > 0) {
            // Add newly arrived processes to queue
            remainingProcesses.forEach(p => {
                if (p.arrivalTime <= currentTime && !queue.includes(p)) {
                    queue.push(p);
                }
            });

            if (queue.length === 0) {
                currentTime++;
                continue;
            }

            const currentProcess = queue.shift();

            if (currentProcess.startTime === -1) {
                currentProcess.startTime = currentTime;
            }

            const executionTime = Math.min(currentProcess.remainingTime, this.quantum);

            schedule.push({
                processId: currentProcess.id,
                startTime: currentTime,
                endTime: currentTime + executionTime,
                duration: executionTime
            });

            currentProcess.remainingTime -= executionTime;
            currentTime += executionTime;

            if (currentProcess.remainingTime > 0) {
                queue.push(currentProcess);
            } else {
                remainingProcesses.splice(remainingProcesses.indexOf(currentProcess), 1);
            }
        }

        return schedule;
    }

    priorityScheduling() {
        const schedule = [];
        let currentTime = 0;
        const remainingProcesses = [...this.processes];

        while (remainingProcesses.length > 0) {
            const availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
            
            if (availableProcesses.length === 0) {
                currentTime++;
                continue;
            }

            const nextProcess = availableProcesses.reduce((min, p) => 
                p.priority < min.priority ? p : min
            );

            if (nextProcess.startTime === -1) {
                nextProcess.startTime = currentTime;
            }

            schedule.push({
                processId: nextProcess.id,
                startTime: currentTime,
                endTime: currentTime + nextProcess.burstTime,
                duration: nextProcess.burstTime
            });

            currentTime += nextProcess.burstTime;
            remainingProcesses.splice(remainingProcesses.indexOf(nextProcess), 1);
        }

        return schedule;
    }

    multilevelQueue() {
        const schedule = [];
        let currentTime = 0;
        const remainingProcesses = [...this.processes];
        
        // Create priority queues (3 levels)
        const highPriorityQueue = [];
        const mediumPriorityQueue = [];
        const lowPriorityQueue = [];

        while (remainingProcesses.length > 0 || highPriorityQueue.length > 0 || 
               mediumPriorityQueue.length > 0 || lowPriorityQueue.length > 0) {
            
            // Add newly arrived processes to appropriate queues
            remainingProcesses.forEach(p => {
                if (p.arrivalTime <= currentTime) {
                    if (p.priority === 1) {
                        highPriorityQueue.push(p);
                    } else if (p.priority === 2) {
                        mediumPriorityQueue.push(p);
                    } else {
                        lowPriorityQueue.push(p);
                    }
                }
            });

            let currentProcess = null;

            // Serve from highest priority queue first
            if (highPriorityQueue.length > 0) {
                currentProcess = highPriorityQueue.shift();
            } else if (mediumPriorityQueue.length > 0) {
                currentProcess = mediumPriorityQueue.shift();
            } else if (lowPriorityQueue.length > 0) {
                currentProcess = lowPriorityQueue.shift();
            }

            if (currentProcess === null) {
                currentTime++;
                continue;
            }

            if (currentProcess.startTime === -1) {
                currentProcess.startTime = currentTime;
            }

            schedule.push({
                processId: currentProcess.id,
                startTime: currentTime,
                endTime: currentTime + currentProcess.burstTime,
                duration: currentProcess.burstTime
            });

            currentTime += currentProcess.burstTime;
            remainingProcesses.splice(remainingProcesses.indexOf(currentProcess), 1);
        }

        return schedule;
    }

    calculateMetrics(schedule) {
        const results = [];

        this.processes.forEach(process => {
            const processSchedule = schedule.filter(s => s.processId === process.id);
            const completionTime = Math.max(...processSchedule.map(s => s.endTime));
            
            const turnaroundTime = completionTime - process.arrivalTime;
            const waitingTime = turnaroundTime - process.burstTime;
            const responseTime = process.startTime - process.arrivalTime;

            results.push({
                ...process,
                completionTime,
                turnaroundTime,
                waitingTime,
                responseTime
            });
        });

        return results;
    }

    displayResults() {
        const tbody = document.getElementById('results-tbody');
        tbody.innerHTML = '';

        this.results.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${result.id}</td>
                <td>${result.arrivalTime}</td>
                <td>${result.burstTime}</td>
                <td>${result.completionTime}</td>
                <td>${result.turnaroundTime}</td>
                <td>${result.waitingTime}</td>
                <td>${result.responseTime}</td>
            `;
            tbody.appendChild(row);
        });

        document.getElementById('results-section').style.display = 'block';
    }

    generateGanttChart(schedule) {
        const ganttChart = document.getElementById('gantt-chart');
        ganttChart.innerHTML = '';

        // Get unique process IDs
        const processIds = [...new Set(schedule.map(s => s.processId))];
        const colors = [
            '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe',
            '#00f2fe', '#43e97b', '#38f9d7', '#fa709a', '#fee140'
        ];

        // Create timeline markers
        const timeMarkers = [];
        schedule.forEach(s => {
            timeMarkers.push(s.startTime, s.endTime);
        });
        const uniqueTimes = [...new Set(timeMarkers)].sort((a, b) => a - b);

        // Create Gantt chart rows
        processIds.forEach((processId, index) => {
            const row = document.createElement('div');
            row.className = 'gantt-row';

            const label = document.createElement('div');
            label.className = 'gantt-label';
            label.textContent = processId;

            const timeline = document.createElement('div');
            timeline.className = 'gantt-timeline';

            // Add process blocks
            const processBlocks = schedule.filter(s => s.processId === processId);
            processBlocks.forEach(block => {
                const blockElement = document.createElement('div');
                blockElement.className = 'gantt-block';
                blockElement.style.backgroundColor = colors[index % colors.length];
                blockElement.style.width = `${(block.duration / Math.max(...uniqueTimes)) * 100}%`;
                blockElement.style.marginLeft = `${(block.startTime / Math.max(...uniqueTimes)) * 100}%`;
                blockElement.textContent = `${block.startTime}-${block.endTime}`;
                blockElement.title = `${processId}: ${block.startTime}-${block.endTime} (${block.duration}ms)`;

                timeline.appendChild(blockElement);
            });

            row.appendChild(label);
            row.appendChild(timeline);
            ganttChart.appendChild(row);
        });

        // Add time markers
        const timeMarkersDiv = document.createElement('div');
        timeMarkersDiv.className = 'gantt-time-markers';
        timeMarkersDiv.style.paddingLeft = '120px';
        
        uniqueTimes.forEach(time => {
            const marker = document.createElement('span');
            marker.textContent = time;
            marker.style.flex = '1';
            marker.style.textAlign = 'center';
            timeMarkersDiv.appendChild(marker);
        });

        ganttChart.appendChild(timeMarkersDiv);
    }

    calculatePerformanceMetrics() {
        const avgTurnaround = this.results.reduce((sum, r) => sum + r.turnaroundTime, 0) / this.results.length;
        const avgWaiting = this.results.reduce((sum, r) => sum + r.waitingTime, 0) / this.results.length;
        const avgResponse = this.results.reduce((sum, r) => sum + r.responseTime, 0) / this.results.length;
        
        const totalBurstTime = this.results.reduce((sum, r) => sum + r.burstTime, 0);
        const totalTime = Math.max(...this.results.map(r => r.completionTime));
        const cpuUtilization = (totalBurstTime / totalTime) * 100;
        const throughput = this.results.length / totalTime;

        document.getElementById('avg-turnaround').textContent = avgTurnaround.toFixed(2);
        document.getElementById('avg-waiting').textContent = avgWaiting.toFixed(2);
        document.getElementById('avg-response').textContent = avgResponse.toFixed(2);
        document.getElementById('cpu-utilization').textContent = `${cpuUtilization.toFixed(1)}%`;
        document.getElementById('throughput').textContent = throughput.toFixed(2);
        document.getElementById('total-time').textContent = totalTime;
    }

    hideResults() {
        document.getElementById('results-section').style.display = 'none';
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${message}
        `;

        const container = document.querySelector('.container');
        container.insertBefore(messageDiv, container.firstChild);

        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Initialize the simulator when the page loads
let simulator;
document.addEventListener('DOMContentLoaded', () => {
    simulator = new SchedulingSimulator();
});

// Export for global access
window.simulator = simulator; 