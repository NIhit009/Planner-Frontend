// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { useState } from 'react';

// interface ReportForm {
//     formData: {

//     }
// }

// export default function ReportForm() {
//     const [formData, setFormData] = useState();
//     return (
//         <div>
//             <div>
//                 <h1>Report a Issue</h1>
//                 <p>You can report issues about tasks..</p>
//             </div>
//             <form>
//                 <div>
//                     <label>Title</label>
//                     <input />
//                 </div>
//                 <div>
//                     <label>Description</label>
//                     <input />
//                 </div>
//                 <div className="space-y-2">
//               <Label className="flex items-center gap-2">
//                 <User className="w-4 h-4" />
//                 Client
//               </Label>
//               <Select 
//                 value={formData.clientId} 
//                 onValueChange={(value) => setFormData({ ...formData, clientId: value })}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {clients.map((client) => (
//                     <SelectItem key={client.accountId._id} value={client.accountId._id}>
//                       {client.accountId.fullName}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             </form>
//         </div>)
// }