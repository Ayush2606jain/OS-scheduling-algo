# OS Scheduling Algorithms Simulator

A comprehensive, interactive web application that simulates various CPU scheduling algorithms used in operating systems. This project provides a visual representation of how different scheduling algorithms work, complete with Gantt charts and performance metrics.

## 🌟 Features

### Supported Scheduling Algorithms

1. **First Come First Serve (FCFS)**
   - Non-preemptive scheduling
   - Processes executed in arrival order
   - Simple implementation but may cause convoy effect

2. **Shortest Job First (SJF)**
   - Non-preemptive scheduling
   - Processes with shortest burst time executed first
   - Optimal for minimizing average waiting time

3. **Shortest Remaining Time First (SRTF)**
   - Preemptive version of SJF
   - Process with shortest remaining time gets CPU
   - Most optimal for minimizing waiting time

4. **Round Robin (RR)**
   - Preemptive scheduling with time quantum
   - Each process gets fixed time slice
   - Prevents starvation and provides fair scheduling

5. **Priority Scheduling**
   - Non-preemptive scheduling based on priority
   - Higher priority processes executed first
   - May cause starvation of low-priority processes

6. **Multilevel Queue**
   - Multiple priority queues
   - Higher priority queues served first
   - Aging mechanism to prevent starvation

### Key Features

- **Interactive Process Management**: Add, remove, and configure processes with arrival time, burst time, and priority
- **Real-time Gantt Charts**: Visual representation of process execution timeline
- **Performance Metrics**: Comprehensive analysis including:
  - Average Turnaround Time
  - Average Waiting Time
  - Average Response Time
  - CPU Utilization
  - Throughput
  - Total Execution Time
- **Sample Data**: Pre-configured examples for quick testing
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Beautiful, intuitive interface with smooth animations

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Installation

1. Clone or download the project files
2. Open `index.html` in your web browser
3. Start using the simulator!

### Usage

1. **Select Algorithm**: Choose from the dropdown menu
2. **Configure Processes**: 
   - Enter Process ID, Arrival Time, Burst Time, and Priority
   - Click "Add Process" or use the "Add Sample Data" button
3. **Calculate Schedule**: Click "Calculate Schedule" to see results
4. **Analyze Results**: View Gantt chart, performance metrics, and detailed process information

## 📊 Algorithm Details

### First Come First Serve (FCFS)
- **Type**: Non-preemptive
- **Advantages**: Simple, fair
- **Disadvantages**: Convoy effect, poor response time
- **Best For**: Batch processing systems

### Shortest Job First (SJF)
- **Type**: Non-preemptive
- **Advantages**: Minimum average waiting time
- **Disadvantages**: Requires knowing burst times
- **Best For**: Batch systems with known job lengths

### Shortest Remaining Time First (SRTF)
- **Type**: Preemptive
- **Advantages**: Optimal for minimizing waiting time
- **Disadvantages**: Context switching overhead
- **Best For**: Interactive systems

### Round Robin (RR)
- **Type**: Preemptive
- **Advantages**: Fair, prevents starvation
- **Disadvantages**: Overhead from context switching
- **Best For**: Time-sharing systems

### Priority Scheduling
- **Type**: Non-preemptive
- **Advantages**: Handles priority-based requirements
- **Disadvantages**: Starvation of low-priority processes
- **Best For**: Real-time systems

### Multilevel Queue
- **Type**: Hybrid
- **Advantages**: Handles different process types
- **Disadvantages**: Complex implementation
- **Best For**: Mixed workload systems

## 🎨 Technical Implementation

### Frontend Technologies
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **JavaScript (ES6+)**: Object-oriented programming with classes and modules
- **Font Awesome**: Icons for enhanced UI
- **Google Fonts**: Typography (Inter font family)

### Key Components

#### SchedulingSimulator Class
- Main application logic
- Algorithm implementations
- Process management
- Results calculation

#### UI Components
- Process input forms
- Interactive tables
- Gantt chart visualization
- Performance metrics display

#### Algorithm Implementations
- Each algorithm implemented as a separate method
- Consistent interface for easy comparison
- Efficient data structures for optimal performance

## 📈 Performance Metrics Explained

### Turnaround Time
- Total time from process arrival to completion
- Formula: `Completion Time - Arrival Time`

### Waiting Time
- Total time process spends waiting in ready queue
- Formula: `Turnaround Time - Burst Time`

### Response Time
- Time from arrival to first CPU allocation
- Formula: `Start Time - Arrival Time`

### CPU Utilization
- Percentage of time CPU is busy
- Formula: `(Total Burst Time / Total Time) × 100`

### Throughput
- Number of processes completed per unit time
- Formula: `Number of Processes / Total Time`

## 🔧 Customization

### Adding New Algorithms
1. Implement the algorithm method in the `SchedulingSimulator` class
2. Add algorithm info to the `algorithmInfo` object
3. Update the `calculateSchedule` method switch statement
4. Add option to the HTML select element

### Styling Customization
- Modify `styles.css` for visual changes
- Color schemes can be adjusted in the CSS variables
- Responsive breakpoints can be modified

### Process Configuration
- Add new process properties in the process object
- Update input forms and tables accordingly
- Modify algorithm logic to handle new properties

## Images 

<img width="1909" height="920" alt="Screenshot 2025-07-12 151038" src="https://github.com/user-attachments/assets/118b9dc2-3ba9-4b5d-ac3f-15340715c6af" />


<img width="1876" height="918" alt="Screenshot 2025-07-12 151111" src="https://github.com/user-attachments/assets/7a5d6b9e-a7bb-4b21-92bf-6cc00de1fb36" />


<img width="1894" height="919" alt="Screenshot 2025-07-12 151126" src="https://github.com/user-attachments/assets/4adfd298-499b-4a70-b16e-86126ed327ec" />


<img width="1909" height="881" alt="Screenshot 2025-07-12 151138" src="https://github.com/user-attachments/assets/975d71f3-7cc4-4175-b8c1-2b756735d31a" />


<img width="1886" height="893" alt="Screenshot 2025-07-12 151155" src="https://github.com/user-attachments/assets/dc1c1905-390e-4281-9f17-e9572c65e941" />


<img width="1872" height="758" alt="Screenshot 2025-07-12 151213" src="https://github.com/user-attachments/assets/1b923770-e100-4477-a5a9-717487cf2242" />

## 🧪 Testing

### Sample Test Cases

#### Test Case 1: Basic FCFS
- Processes: P1(0,4), P2(1,3), P3(2,1)
- Expected: Sequential execution in arrival order

#### Test Case 2: SJF Optimization
- Processes: P1(0,6), P2(1,4), P3(2,2), P4(3,8)
- Expected: P1 → P3 → P2 → P4 (optimal order)

#### Test Case 3: Round Robin Fairness
- Processes: P1(0,5), P2(1,3), P3(2,1)
- Quantum: 2
- Expected: Alternating execution with time slices

## 📝 Project Structure

```
os-scheduling-simulator/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript application logic
├── README.md           # Project documentation
└── assets/             # Additional resources (if any)
```

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Operating Systems concepts and algorithms
- Modern web development practices
- UI/UX design principles
- Educational resources for OS scheduling

## 📞 Contact

For questions, suggestions, or contributions:
- Create an issue on the project repository

