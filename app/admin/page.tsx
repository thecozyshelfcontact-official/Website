import { query } from '@/lib/db'
import { Package, FileText, Tag, MousePointerClick } from 'lucide-react'

export default async function AdminDashboard() {
  const [[{ count: products }], [{ count: posts }], [{ count: categories }], [{ count: clicks }]] = await Promise.all([
    query('SELECT COUNT(*) FROM products'),
    query('SELECT COUNT(*) FROM blog_posts'),
    query('SELECT COUNT(*) FROM categories'),
    query('SELECT COUNT(*) FROM click_events'),
  ])
  const stats = [
    { label:'Products', value:products, icon:Package, color:'bg-blue-500' },
    { label:'Blog Posts', value:posts, icon:FileText, color:'bg-green-500' },
    { label:'Categories', value:categories, icon:Tag, color:'bg-purple-500' },
    { label:'Total Clicks', value:clicks, icon:MousePointerClick, color:'bg-orange-500' },
  ]
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon size={20} className="text-white" />
            </div>
            <div className="text-3xl font-bold">{Number(s.value).toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}