
import { TaskStatus, TaskPriority } from '@/lib/types/task';

export { TaskStatus, TaskPriority };

export const demoTasks = [
  {
    id: "task-1",
    title: "Create wireframes for homepage redesign",
    description: "Create detailed wireframes for the new homepage design based on the approved mockups.",
    status: "done" as TaskStatus,
    priority: "high" as TaskPriority,
    due_date: "2023-12-15",
    dueDate: "2023-12-15",
    completed: true,
    project_id: "1",
    assignees: [
      { id: "user2", name: "Bob Smith", avatar: "/avatars/user2.png" }
    ],
    subtasks: [
      { id: "subtask-1-1", task_id: "task-1", title: "Research competitor websites", completed: true },
      { id: "subtask-1-2", task_id: "task-1", title: "Draft initial wireframes", completed: true },
      { id: "subtask-1-3", task_id: "task-1", title: "Review with design team", completed: true }
    ]
  },
  {
    id: "task-2",
    title: "Implement user authentication system",
    description: "Set up the user authentication system including login, registration, and password reset functionality.",
    status: "in-progress" as TaskStatus,
    priority: "high" as TaskPriority,
    due_date: "2023-12-20",
    dueDate: "2023-12-20",
    completed: false,
    project_id: "1",
    assignees: [
      { id: "user10", name: "Jack Thompson", avatar: "/avatars/user10.png" }
    ],
    subtasks: [
      { id: "subtask-2-1", task_id: "task-2", title: "Create login form", completed: true },
      { id: "subtask-2-2", task_id: "task-2", title: "Implement backend authentication", completed: true },
      { id: "subtask-2-3", task_id: "task-2", title: "Set up password reset flow", completed: false },
      { id: "subtask-2-4", task_id: "task-2", title: "Test authentication flow", completed: false }
    ]
  },
  {
    id: "task-3",
    title: "Design product detail page",
    description: "Create a new design for the product detail page that showcases product features better.",
    status: "to-do" as TaskStatus,
    priority: "medium" as TaskPriority,
    due_date: "2023-12-22",
    dueDate: "2023-12-22",
    completed: false,
    project_id: "1",
    assignees: [
      { id: "user3", name: "Carol Williams", avatar: "/avatars/user3.png" },
      { id: "user12", name: "Leo Anderson", avatar: "/avatars/user12.png" }
    ],
    subtasks: [
      { id: "subtask-3-1", task_id: "task-3", title: "Research user needs", completed: false },
      { id: "subtask-3-2", task_id: "task-3", title: "Create mockups", completed: false }
    ]
  },
  {
    id: "task-4",
    title: "Set up CI/CD pipeline",
    description: "Configure continuous integration and deployment pipeline for the project to streamline development workflow.",
    status: "in-progress" as TaskStatus,
    priority: "high" as TaskPriority,
    due_date: "2023-12-18",
    dueDate: "2023-12-18",
    completed: false,
    project_id: "1",
    assignees: [
      { id: "user10", name: "Jack Thompson", avatar: "/avatars/user10.png" }
    ]
  },
  {
    id: "task-5",
    title: "Create iOS app wireframes",
    description: "Design wireframes for the iOS mobile application that matches the web experience.",
    status: "in-review" as TaskStatus,
    priority: "medium" as TaskPriority,
    due_date: "2023-12-25",
    dueDate: "2023-12-25",
    completed: false,
    project_id: "2",
    assignees: [
      { id: "user4", name: "Dave Brown", avatar: "/avatars/user4.png" }
    ]
  },
  {
    id: "task-6",
    title: "Implement basic Android UI components",
    description: "Create the foundational UI components for the Android application following the design guidelines.",
    status: "in-progress" as TaskStatus,
    priority: "medium" as TaskPriority,
    due_date: "2024-01-05",
    dueDate: "2024-01-05",
    completed: false,
    project_id: "2",
    assignees: [
      { id: "user5", name: "Eve Davis", avatar: "/avatars/user5.png" }
    ]
  },
  {
    id: "task-7",
    title: "Create content calendar for Q2",
    description: "Develop a comprehensive content calendar for all marketing channels for the second quarter.",
    status: "done" as TaskStatus,
    priority: "high" as TaskPriority,
    due_date: "2023-02-28",
    dueDate: "2023-02-28",
    completed: true,
    project_id: "3",
    assignees: [
      { id: "user7", name: "Grace Lee", avatar: "/avatars/user7.png" }
    ]
  },
  {
    id: "task-8",
    title: "Keyword research and SEO strategy",
    description: "Conduct thorough keyword research and develop an SEO strategy for the quarter.",
    status: "done" as TaskStatus,
    priority: "high" as TaskPriority,
    due_date: "2023-03-10",
    dueDate: "2023-03-10",
    completed: true,
    project_id: "3",
    assignees: [
      { id: "user8", name: "Henry Wilson", avatar: "/avatars/user8.png" }
    ]
  },
  {
    id: "task-9",
    title: "Optimize database queries",
    description: "Review and optimize the most resource-intensive database queries to improve performance.",
    status: "in-progress" as TaskStatus,
    priority: "high" as TaskPriority,
    due_date: "2023-12-28",
    dueDate: "2023-12-28",
    completed: false,
    project_id: "4",
    assignees: [
      { id: "user9", name: "Irene Garcia", avatar: "/avatars/user9.png" }
    ]
  },
  {
    id: "task-10",
    title: "Define support ticket categories",
    description: "Define and configure the categories for customer support tickets in the new portal.",
    status: "done" as TaskStatus,
    priority: "medium" as TaskPriority,
    due_date: "2023-12-10",
    dueDate: "2023-12-10",
    completed: true,
    project_id: "5",
    assignees: [
      { id: "user11", name: "Karen Martinez", avatar: "/avatars/user11.png" }
    ]
  }
];
