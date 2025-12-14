import { auth } from "@/lib/auth";
import { getExpenses } from "@/app/actions/expenses";
import { ExpenseList } from "@/components/expenses/expense-list";
import { AddExpenseDialog } from "@/components/expenses/add-expense-dialog";

export default async function ExpensesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const expenses = await getExpenses(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-muted-foreground">Track your business expenses</p>
        </div>
        <AddExpenseDialog userId={session.user.id} />
      </div>
      <ExpenseList expenses={expenses} userId={session.user.id} />
    </div>
  );
}

