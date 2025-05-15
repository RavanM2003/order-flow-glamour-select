
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import DetailDrawer from '@/components/common/DetailDrawer';
import { CreditCard, Wallet, Banknote, Terminal, CheckCircle2, Clock, XCircle, Plus, Edit, Check, X, Pencil } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define a type for payments
type Payment =
  | {
      id: number;
      type: 'income';
      source: string;
      customer: string;
      amount: number;
      method: string;
      status: string;
      date: string;
      details?: string;
    }
  | {
      id: number;
      type: 'expense';
      category: string;
      description: string;
      amount: number;
      date: string;
      details?: string;
    };

const initialPayments: Payment[] = [
  { id: 1, type: 'income', source: 'Appointment', customer: 'Anna Johnson', amount: 195, method: 'card', status: 'confirmed', date: '2025-05-10', details: 'Facial Treatment' },
  { id: 2, type: 'expense', category: 'Kommunal', description: 'İşıq pulu', amount: 50, date: '2025-05-10' },
];

const paymentSources = [
  { value: 'Appointment', label: 'Appointment' },
  { value: 'Manual', label: 'Manual' },
];
const paymentMethods = [
  { value: 'card', label: 'Kart', icon: CreditCard },
  { value: 'cash', label: 'Nağd', icon: Wallet },
  { value: 'bank', label: 'Bank', icon: Banknote },
  { value: 'pos', label: 'POS', icon: Terminal },
];
const paymentStatuses = [
  { value: 'confirmed', label: 'Təsdiqləndi', icon: CheckCircle2, color: 'bg-green-100 text-green-700' },
  { value: 'waiting', label: 'Gözləmədə', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
  { value: 'rejected', label: 'İmtina olundu', icon: XCircle, color: 'bg-red-100 text-red-700' },
];
const expenseCategories = [
  { value: 'Telekommunikasiya', label: 'Telekommunikasiya' },
  { value: 'Kommunal', label: 'Kommunal' },
  { value: 'Arenda', label: 'Arenda' },
  { value: 'Digər', label: 'Digər' },
];

const CashTab = () => {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('income'); // Default to income tab
  const [editMode, setEditMode] = useState(false);

  // Form state
  const [incomeForm, setIncomeForm] = useState({
    amount: '',
    customer: '',
    source: 'Appointment',
    method: 'card',
    status: 'confirmed',
    date: new Date().toISOString().slice(0, 10),
    details: '',
  });
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    category: 'Telekommunikasiya',
    description: '',
    date: new Date().toISOString().slice(0, 10),
    details: '',
  });
  const [formError, setFormError] = useState('');

  // Günlük gələn və çıxanların hesablanması
  const totalIncome = payments.filter(p => p.type === 'income').reduce((sum, p) => sum + p.amount, 0);
  const totalExpense = payments.filter(p => p.type === 'expense').reduce((sum, p) => sum + p.amount, 0);

  // Form submit handlers
  const handleIncomeSubmit = (e) => {
    e.preventDefault();
    if (!incomeForm.amount || !incomeForm.customer) {
      setFormError('Məbləğ və Müştəri adı vacibdir');
      return;
    }
    if (editMode && selected) {
      setPayments(payments => payments.map(p =>
        p.id === selected.id
          ? { ...p, ...incomeForm, amount: Number(incomeForm.amount) }
          : p
      ));
      setEditMode(false);
      setSelected(null);
    } else {
      setPayments([
        {
          id: payments.length + 1,
          type: 'income',
          ...incomeForm,
          amount: Number(incomeForm.amount),
        },
        ...payments,
      ]);
    }
    setDrawerOpen(false);
    setActiveTab('income');
    setIncomeForm({
      amount: '',
      customer: '',
      source: 'Appointment',
      method: 'card',
      status: 'confirmed',
      date: new Date().toISOString().slice(0, 10),
      details: '',
    });
    setFormError('');
  };
  
  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expenseForm.amount || !expenseForm.description) {
      setFormError('Məbləğ və Açıklama vacibdir');
      return;
    }
    setPayments([
      {
        id: payments.length + 1,
        type: 'expense',
        ...expenseForm,
        amount: Number(expenseForm.amount),
      },
      ...payments,
    ]);
    setDrawerOpen(false);
    setActiveTab('income');
    setExpenseForm({
      amount: '',
      category: 'Telekommunikasiya',
      description: '',
      date: new Date().toISOString().slice(0, 10),
      details: '',
    });
    setFormError('');
  };

  const handleConfirm = () => {
    if (!selected) return;
    setPayments(payments => payments.map(p =>
      p.id === selected.id ? { ...p, status: 'confirmed' } : p
    ));
    setDrawerOpen(false);
    setSelected(null);
  };
  
  const handleReject = () => {
    if (!selected) return;
    setPayments(payments => payments.map(p =>
      p.id === selected.id ? { ...p, status: 'rejected' } : p
    ));
    setDrawerOpen(false);
    setSelected(null);
  };

  const handleEdit = () => {
    if (!selected) return;
    setEditMode(true);
    if (selected.type === 'income') {
      setIncomeForm({
        amount: selected.amount.toString(),
        customer: selected.customer,
        source: selected.source,
        method: selected.method,
        status: selected.status,
        date: selected.date,
        details: selected.details || '',
      });
      setActiveTab('income');
    } else {
      setExpenseForm({
        amount: selected.amount.toString(),
        category: selected.category,
        description: selected.description,
        date: selected.date,
        details: selected.details || '',
      });
      setActiveTab('expense');
    }
  };

  const openCreateDrawer = () => {
    setEditMode(false);
    setSelected(null);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-glamour-800">Cash</h2>
        <Button className="bg-glamour-700 text-white" onClick={openCreateDrawer}>
          <Plus className="w-4 h-4 mr-2" />
          Ödəniş Yarat
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-lg font-semibold text-green-700">Gələnlər</div>
          <div className="text-2xl font-bold">{totalIncome} ₼</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-lg font-semibold text-red-700">Xərclər</div>
          <div className="text-2xl font-bold">{totalExpense} ₼</div>
        </div>
      </div>
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-2 text-left">Tip</th>
              <th className="p-2 text-left">Mənbə/Kateqoriya</th>
              <th className="p-2 text-left">Müştəri/Təsvir</th>
              <th className="p-2 text-right">Məbləğ</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Tarix</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-blue-50 cursor-pointer" onClick={() => { setSelected(p); setDrawerOpen(true); setActiveTab(null); }}>
                <td className="p-2">{p.type === 'income' ? 'Gəlir' : 'Xərc'}</td>
                <td className="p-2">{p.type === 'income' ? p.source : p.category}</td>
                <td className="p-2">{p.type === 'income' ? p.customer : p.description}</td>
                <td className="p-2 text-right">{p.amount} ₼</td>
                <td className="p-2">
                  {p.type === 'income' ? (
                    (() => {
                      const status = paymentStatuses.find(s => s.value === p.status);
                      return status ? (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          <status.icon className="w-4 h-4" />
                          {status.label}
                        </span>
                      ) : p.status;
                    })()
                  ) : '-'}
                </td>
                <td className="p-2">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Drawer for details or add */}
      <DetailDrawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen} 
        title={selected && !editMode ? 'Detallar' : 'Ödəniş Yarat'}
      >
        {/* Create/Edit Form with Tabs */}
        {!selected || editMode ? (
          <Tabs defaultValue={activeTab} className="p-4" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="income">Gəlir</TabsTrigger>
              <TabsTrigger value="expense">Xərc</TabsTrigger>
            </TabsList>
            
            {/* Income Tab Content */}
            <TabsContent value="income">
              <form className="space-y-4" onSubmit={handleIncomeSubmit}>
                <div>
                  <label className="block mb-1 font-medium">Məbləğ <span className="text-red-500">*</span></label>
                  <input type="number" min="1" className="w-full border rounded px-3 py-2" value={incomeForm.amount} onChange={e => setIncomeForm(f => ({ ...f, amount: e.target.value }))} required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Müştəri adı <span className="text-red-500">*</span></label>
                  <input className="w-full border rounded px-3 py-2" value={incomeForm.customer} onChange={e => setIncomeForm(f => ({ ...f, customer: e.target.value }))} required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Mənbə</label>
                  <select className="w-full border rounded px-3 py-2" value={incomeForm.source} onChange={e => setIncomeForm(f => ({ ...f, source: e.target.value }))}>
                    {paymentSources.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Ödəniş növü</label>
                  <div className="flex gap-3 flex-wrap">
                    {paymentMethods.map(opt => (
                      <label key={opt.value} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${incomeForm.method === opt.value ? 'border-glamour-700 bg-glamour-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                        <input
                          type="radio"
                          name="method"
                          value={opt.value}
                          checked={incomeForm.method === opt.value}
                          onChange={() => setIncomeForm(f => ({ ...f, method: opt.value }))}
                          className="accent-glamour-700"
                        />
                        <opt.icon className="w-5 h-5" />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Status</label>
                  <div className="flex gap-3 flex-wrap">
                    {paymentStatuses.map(opt => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all
                          ${incomeForm.status === opt.value
                            ? `${opt.color} border-glamour-700 ring-2 ring-glamour-300`
                            : `${opt.color} border-gray-200 opacity-70 hover:opacity-100`}
                        `}
                      >
                        <input
                          type="radio"
                          name="status"
                          value={opt.value}
                          checked={incomeForm.status === opt.value}
                          onChange={() => setIncomeForm(f => ({ ...f, status: opt.value }))}
                          className="accent-glamour-700 hidden"
                        />
                        <opt.icon className="w-5 h-5" />
                        <span className="font-medium">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Tarix</label>
                  <input type="date" className="w-full border rounded px-3 py-2" value={incomeForm.date} onChange={e => setIncomeForm(f => ({ ...f, date: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Əlavə qeydlər</label>
                  <textarea className="w-full border rounded px-3 py-2" value={incomeForm.details} onChange={e => setIncomeForm(f => ({ ...f, details: e.target.value }))} />
                </div>
                {formError && <div className="text-red-600 text-sm">{formError}</div>}
                <Button type="submit" className="bg-glamour-700 text-white w-full">Yarat</Button>
              </form>
            </TabsContent>
            
            {/* Expense Tab Content */}
            <TabsContent value="expense">
              <form className="space-y-4" onSubmit={handleExpenseSubmit}>
                <div>
                  <label className="block mb-1 font-medium">Məbləğ <span className="text-red-500">*</span></label>
                  <input type="number" min="1" className="w-full border rounded px-3 py-2" value={expenseForm.amount} onChange={e => setExpenseForm(f => ({ ...f, amount: e.target.value }))} required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Kateqoriya</label>
                  <select className="w-full border rounded px-3 py-2" value={expenseForm.category} onChange={e => setExpenseForm(f => ({ ...f, category: e.target.value }))}>
                    {expenseCategories.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Açıklama <span className="text-red-500">*</span></label>
                  <input className="w-full border rounded px-3 py-2" value={expenseForm.description} onChange={e => setExpenseForm(f => ({ ...f, description: e.target.value }))} required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Tarix</label>
                  <input type="date" className="w-full border rounded px-3 py-2" value={expenseForm.date} onChange={e => setExpenseForm(f => ({ ...f, date: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Əlavə qeydlər</label>
                  <textarea className="w-full border rounded px-3 py-2" value={expenseForm.details} onChange={e => setExpenseForm(f => ({ ...f, details: e.target.value }))} />
                </div>
                {formError && <div className="text-red-600 text-sm">{formError}</div>}
                <Button type="submit" className="bg-glamour-700 text-white w-full">Yarat</Button>
              </form>
            </TabsContent>
          </Tabs>
        ) : (
          /* Details view */
          <div className="space-y-4 p-4">
            <div className="mb-2 font-bold text-lg">{selected.type === 'income' ? 'Gəlir Detalları' : 'Xərc Detalları'}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
                <div className="text-xs text-gray-500">Məbləğ</div>
                <div className="text-2xl font-bold text-glamour-700">{selected.amount} ₼</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
                <div className="text-xs text-gray-500">Tarix</div>
                <div className="text-base">{selected.date}</div>
              </div>
              {selected.type === 'income' && (
                <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2 col-span-2 sm:col-span-1">
                  <div className="text-xs text-gray-500">Müştəri</div>
                  <div className="text-base font-medium">{selected.customer}</div>
                </div>
              )}
              {selected.type === 'expense' && (
                <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2 col-span-2 sm:col-span-1">
                  <div className="text-xs text-gray-500">Açıklama</div>
                  <div className="text-base font-medium">{selected.description}</div>
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2 col-span-2 sm:col-span-1">
                <div className="text-xs text-gray-500">{selected.type === 'income' ? 'Mənbə' : 'Kateqoriya'}</div>
                <div className="text-base font-medium">{selected.type === 'income' ? selected.source : selected.category}</div>
              </div>
              {selected.type === 'income' && (
                <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2 col-span-2 sm:col-span-1">
                  <div className="text-xs text-gray-500">Ödəniş növü</div>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const method = paymentMethods.find(m => m.value === selected.method);
                      return method ? <><method.icon className="w-5 h-5 text-glamour-700" /><span>{method.label}</span></> : selected.method;
                    })()}
                  </div>
                </div>
              )}
              {selected.type === 'income' && (
                <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2 col-span-2 sm:col-span-1">
                  <div className="text-xs text-gray-500">Status</div>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const status = paymentStatuses.find(s => s.value === selected.status);
                      return status ? <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}><status.icon className="w-4 h-4" />{status.label}</span> : selected.status;
                    })()}
                  </div>
                </div>
              )}
            </div>
            {selected.details && <div className="bg-gray-50 rounded-lg p-4"><div className="text-xs text-gray-500 mb-1">Əlavə qeydlər</div><div>{selected.details}</div></div>}
            {selected.type === 'income' && selected.status === 'waiting' && (
              <div className="flex gap-3 mt-6">
                <Button className="bg-green-600 hover:bg-green-700 text-white flex-1" onClick={handleConfirm}>
                  <Check className="h-4 w-4 mr-1" />
                  Təsdiqlə
                </Button>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white flex-1" variant="outline" onClick={handleEdit}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Düzəliş et
                </Button>
                <Button className="bg-red-600 hover:bg-red-700 text-white flex-1" onClick={handleReject}>
                  <X className="h-4 w-4 mr-1" />
                  İmtina et
                </Button>
              </div>
            )}
          </div>
        )}
      </DetailDrawer>
    </div>
  );
};

export default CashTab;
