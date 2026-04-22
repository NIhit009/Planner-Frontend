// Types
export interface Client {
  accountId: {
    _id: string;
    fullName: string;
    email: string;
  }
  avatar: string;
  companyName: string;
  status: 'active' | 'inactive';
  joinedAt: string;
}

export interface Task {
  _id: string;
  clientId: string;
  name: string;
  description: string;
  type: 'video' | 'banner' | 'image' | 'website';
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  deadline: string;
  startTime?: string;
  driveLink?: string;
  targetViews: number;
  achievedViews: number;
  createdAt: string;
}

export interface Issue {
  id: string;
  clientId: string;
  taskId?: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  resolvedAt?: string;
}

export interface BulkRequest {
  id: string;
  clientId: string;
  type: 'video' | 'banner' | 'image' | 'website';
  quantity: number;
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// Mock Data
export const clients: Client[] = [
];
export const tasks: Task[] = [
  // Client 1 tasks
  // {
  //   id: 'task-1',
  //   clientId: 'client-1',
  //   title: 'Design Campaign Video',
  //   description: 'Create a 30-second promotional video for summer campaign',
  //   type: 'video',
  //   status: 'completed',
  //   dueDate: '2023-08-03',
  //   startTime: '01:00pm',
  //   driveLink: 'https://drive.google.com/file/d/example1',
  //   targetViews: 10000,
  //   achievedViews: 8500,
  //   createdAt: '2023-07-20',
  // },
  // {
  //   id: 'task-2',
  //   clientId: 'client-1',
  //   title: 'Weekly Standup Meeting',
  //   description: 'Weekly sync with design team',
  //   type: 'website',
  //   status: 'completed',
  //   dueDate: '2023-08-08',
  //   startTime: '07:30am',
  //   driveLink: '',
  //   targetViews: 0,
  //   achievedViews: 0,
  //   createdAt: '2023-08-01',
  // },
  // {
  //   id: 'task-3',
  //   clientId: 'client-1',
  //   title: 'Design Class Session',
  //   description: 'Interactive design workshop',
  //   type: 'video',
  //   status: 'in-progress',
  //   dueDate: '2023-08-08',
  //   startTime: '10:20am',
  //   driveLink: 'https://drive.google.com/file/d/example3',
  //   targetViews: 5000,
  //   achievedViews: 3200,
  //   createdAt: '2023-08-01',
  // },
  // {
  //   id: 'task-4',
  //   clientId: 'client-1',
  //   title: 'P2P Zoom Call',
  //   description: 'Client feedback session',
  //   type: 'website',
  //   status: 'pending',
  //   dueDate: '2023-08-08',
  //   startTime: '01:00pm',
  //   driveLink: '',
  //   targetViews: 0,
  //   achievedViews: 0,
  //   createdAt: '2023-08-02',
  // },
  // {
  //   id: 'task-5',
  //   clientId: 'client-1',
  //   title: 'Birthday Banner Design',
  //   description: 'Create celebratory banner for client event',
  //   type: 'banner',
  //   status: 'completed',
  //   dueDate: '2023-08-08',
  //   startTime: '12:10pm',
  //   driveLink: 'https://drive.google.com/file/d/example5',
  //   targetViews: 2000,
  //   achievedViews: 2400,
  //   createdAt: '2023-08-01',
  // },
  // // Client 2 tasks
  // {
  //   id: 'task-6',
  //   clientId: 'client-2',
  //   title: 'Standup Report',
  //   description: 'Daily standup summary',
  //   type: 'website',
  //   status: 'completed',
  //   dueDate: '2023-08-09',
  //   startTime: '07:45am',
  //   driveLink: '',
  //   targetViews: 0,
  //   achievedViews: 0,
  //   createdAt: '2023-08-05',
  // },
  // {
  //   id: 'task-7',
  //   clientId: 'client-2',
  //   title: 'Go to Office',
  //   description: 'In-person meeting',
  //   type: 'website',
  //   status: 'delayed',
  //   dueDate: '2023-08-09',
  //   startTime: '10:10am',
  //   driveLink: '',
  //   targetViews: 0,
  //   achievedViews: 0,
  //   createdAt: '2023-08-05',
  // },
  // {
  //   id: 'task-8',
  //   clientId: 'client-2',
  //   title: 'Group Workshop',
  //   description: 'Team collaboration session',
  //   type: 'video',
  //   status: 'in-progress',
  //   dueDate: '2023-08-09',
  //   startTime: '10:10am',
  //   driveLink: 'https://drive.google.com/file/d/example8',
  //   targetViews: 3000,
  //   achievedViews: 1800,
  //   createdAt: '2023-08-05',
  // },
  // {
  //   id: 'task-9',
  //   clientId: 'client-2',
  //   title: 'Task Overview',
  //   description: 'Review pending tasks',
  //   type: 'website',
  //   status: 'pending',
  //   dueDate: '2023-08-09',
  //   startTime: '01:30pm',
  //   driveLink: '',
  //   targetViews: 0,
  //   achievedViews: 0,
  //   createdAt: '2023-08-05',
  // },
  // {
  //   id: 'task-10',
  //   clientId: 'client-2',
  //   title: 'Meeting Notes',
  //   description: 'Document meeting outcomes',
  //   type: 'website',
  //   status: 'completed',
  //   dueDate: '2023-08-09',
  //   startTime: '12:10pm',
  //   driveLink: '',
  //   targetViews: 0,
  //   achievedViews: 0,
  //   createdAt: '2023-08-05',
  // },
  // // Client 3 tasks
  // {
  //   id: 'task-11',
  //   clientId: 'client-3',
  //   title: 'Breakfast Meeting',
  //   description: 'Morning sync with team',
  //   type: 'website',
  //   status: 'completed',
  //   dueDate: '2023-08-10',
  //   startTime: '07:30am',
  //   driveLink: '',
  //   targetViews: 0,
  //   achievedViews: 0,
  //   createdAt: '2023-08-06',
  // },
  // {
  //   id: 'task-12',
  //   clientId: 'client-3',
  //   title: 'Prototype Review',
  //   description: 'Review latest prototype designs',
  //   type: 'image',
  //   status: 'in-progress',
  //   dueDate: '2023-08-11',
  //   startTime: '08:45am',
  //   driveLink: 'https://drive.google.com/file/d/example12',
  //   targetViews: 1500,
  //   achievedViews: 900,
  //   createdAt: '2023-08-07',
  // },
  // {
  //   id: 'task-13',
  //   clientId: 'client-3',
  //   title: 'Reunion Event',
  //   description: 'Team reunion planning',
  //   type: 'banner',
  //   status: 'pending',
  //   dueDate: '2023-08-11',
  //   startTime: '01:50pm',
  //   driveLink: 'https://drive.google.com/file/d/example13',
  //   targetViews: 500,
  //   achievedViews: 0,
  //   createdAt: '2023-08-07',
  // },
  // {
  //   id: 'task-14',
  //   clientId: 'client-3',
  //   title: 'Lunch Meeting',
  //   description: 'Client lunch discussion',
  //   type: 'website',
  //   status: 'completed',
  //   dueDate: '2023-08-17',
  //   startTime: '07:30am',
  //   driveLink: '',
  //   targetViews: 0,
  //   achievedViews: 0,
  //   createdAt: '2023-08-10',
  // },
  // {
  //   id: 'task-15',
  //   clientId: 'client-3',
  //   title: 'P2P Zoom',
  //   description: 'One-on-one video call',
  //   type: 'video',
  //   status: 'delayed',
  //   dueDate: '2023-08-16',
  //   startTime: '01:00pm',
  //   driveLink: 'https://drive.google.com/file/d/example15',
  //   targetViews: 100,
  //   achievedViews: 45,
  //   createdAt: '2023-08-10',
  // },
  // // More tasks for variety
  // {
  //   id: 'task-16',
  //   clientId: 'client-1',
  //   title: 'Lunch with Team',
  //   description: 'Team lunch outing',
  //   type: 'website',
  //   status: 'completed',
  //   dueDate: '2023-08-05',
  //   startTime: '07:30am',
  //   driveLink: '',
  //   targetViews: 0,
  //   achievedViews: 0,
  //   createdAt: '2023-08-01',
  // },
  // {
  //   id: 'task-17',
  //   clientId: 'client-2',
  //   title: 'Meeting Room',
  //   description: 'Conference room booking',
  //   type: 'website',
  //   status: 'completed',
  //   dueDate: '2023-08-05',
  //   startTime: '10:30am',
  //   driveLink: '',
  //   targetViews: 0,
  //   achievedViews: 0,
  //   createdAt: '2023-08-01',
  // },
  // {
  //   id: 'task-18',
  //   clientId: 'client-4',
  //   title: 'Go to Client Site',
  //   description: 'On-site visit',
  //   type: 'website',
  //   status: 'pending',
  //   dueDate: '2023-08-01',
  //   startTime: '01:00pm',
  //   driveLink: '',
  //   targetViews: 0,
  //   achievedViews: 0,
  //   createdAt: '2023-07-25',
  // },
  // {
  //   id: 'task-19',
  //   clientId: 'client-1',
  //   title: 'Group Workshop',
  //   description: 'Collaborative workshop session',
  //   type: 'video',
  //   status: 'completed',
  //   dueDate: '2023-08-22',
  //   startTime: '01:00pm',
  //   driveLink: 'https://drive.google.com/file/d/example19',
  //   targetViews: 2500,
  //   achievedViews: 2100,
  //   createdAt: '2023-08-15',
  // },
  // {
  //   id: 'task-20',
  //   clientId: 'client-3',
  //   title: 'Reunion Planning',
  //   description: 'Plan upcoming reunion event',
  //   type: 'banner',
  //   status: 'in-progress',
  //   dueDate: '2023-08-25',
  //   startTime: '07:30am',
  //   driveLink: 'https://drive.google.com/file/d/example20',
  //   targetViews: 1000,
  //   achievedViews: 450,
  //   createdAt: '2023-08-18',
  // },
  // {
  //   id: 'task-21',
  //   clientId: 'client-2',
  //   title: 'Design Class',
  //   description: 'Advanced design techniques',
  //   type: 'video',
  //   status: 'pending',
  //   dueDate: '2023-08-25',
  //   startTime: '10:30am',
  //   driveLink: 'https://drive.google.com/file/d/example21',
  //   targetViews: 4000,
  //   achievedViews: 0,
  //   createdAt: '2023-08-18',
  // },
  // {
  //   id: 'task-22',
  //   clientId: 'client-1',
  //   title: 'Weekly Review',
  //   description: 'End of week review meeting',
  //   type: 'website',
  //   status: 'pending',
  //   dueDate: '2023-08-25',
  //   startTime: '01:50pm',
  //   driveLink: '',
  //   targetViews: 0,
  //   achievedViews: 0,
  //   createdAt: '2023-08-18',
  // },
  // {
  //   id: 'task-23',
  //   clientId: 'client-3',
  //   title: 'Breakfast Sync',
  //   description: 'Morning alignment meeting',
  //   type: 'website',
  //   status: 'completed',
  //   dueDate: '2023-08-30',
  //   startTime: '07:30am',
  //   driveLink: '',
  //   targetViews: 0,
  //   achievedViews: 0,
  //   createdAt: '2023-08-23',
  // },
  // {
  //   id: 'task-24',
  //   clientId: 'client-2',
  //   title: 'Group Meeting',
  //   description: 'Cross-team alignment',
  //   type: 'website',
  //   status: 'in-progress',
  //   dueDate: '2023-08-19',
  //   startTime: '07:30am',
  //   driveLink: '',
  //   targetViews: 0,
  //   achievedViews: 0,
  //   createdAt: '2023-08-12',
  // },
];

export const issues: Issue[] = [
  {
    id: 'issue-1',
    clientId: 'client-1',
    taskId: 'task-1',
    title: 'Video quality issue',
    description: 'The exported video has lower resolution than expected',
    status: 'resolved',
    priority: 'high',
    createdAt: '2023-08-05',
    resolvedAt: '2023-08-07',
  },
  {
    id: 'issue-2',
    clientId: 'client-2',
    taskId: 'task-7',
    title: 'Meeting rescheduled',
    description: 'Client requested to postpone the meeting',
    status: 'in-progress',
    priority: 'medium',
    createdAt: '2023-08-08',
  },
  {
    id: 'issue-3',
    clientId: 'client-3',
    taskId: 'task-15',
    title: 'Connection problems',
    description: 'Zoom call keeps disconnecting',
    status: 'pending',
    priority: 'high',
    createdAt: '2023-08-16',
  },
  {
    id: 'issue-4',
    clientId: 'client-1',
    title: 'General inquiry',
    description: 'Questions about upcoming campaign timeline',
    status: 'pending',
    priority: 'low',
    createdAt: '2023-08-18',
  },
];

export const bulkRequests: BulkRequest[] = [
  {
    id: 'bulk-1',
    clientId: 'client-1',
    type: 'banner',
    quantity: 5,
    notes: 'Need 5 banners for social media campaign',
    status: 'approved',
    createdAt: '2023-08-01',
  },
  {
    id: 'bulk-2',
    clientId: 'client-2',
    type: 'video',
    quantity: 3,
    notes: 'Product demo videos needed',
    status: 'pending',
    createdAt: '2023-08-10',
  },
  {
    id: 'bulk-3',
    clientId: 'client-3',
    type: 'image',
    quantity: 10,
    notes: 'Website product images',
    status: 'pending',
    createdAt: '2023-08-15',
  },
];

// Helper functions
export const getClientById = (id: string) => clients.find(c => c.accountId._id === id);
export const getTasksByClientId = (clientId: string) => tasks.filter(t => t.clientId === clientId);
export const getIssuesByClientId = (clientId: string) => issues.filter(i => i.clientId === clientId);
export const getBulkRequestsByClientId = (clientId: string) => bulkRequests.filter(b => b.clientId === clientId);

export const getTasksByDate = (date: string) => tasks.filter(t => t.deadline === date);

export const getTaskStats = () => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const delayed = tasks.filter(t => t.status === 'delayed').length;

  return { total, completed, pending, inProgress, delayed };
};

export const getIssueStats = () => {
  const total = issues.length;
  const pending = issues.filter(i => i.status === 'pending').length;
  const inProgress = issues.filter(i => i.status === 'in-progress').length;
  const resolved = issues.filter(i => i.status === 'resolved').length;

  return { total, pending, inProgress, resolved };
};
