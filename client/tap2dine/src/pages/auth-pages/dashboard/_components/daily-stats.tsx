import { DollarSign, ShoppingBag, Users } from 'lucide-react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/card'
import { useMemo } from 'react'
import { TOrderResponseType } from '../../../../types/response.types'


export function DailyStats({data:orders}:{data:TOrderResponseType[]}) {
    // Calculate statistics for today's orders
    const stats = useMemo(() => {
        const checkedOutOrders = orders.filter(order => order.checked_out)
        const today = new Date().toISOString().split('T')[0]

        // Filter orders for today
        const todaysOrders = checkedOutOrders.filter(order =>
            order.created_at.startsWith(today)
        )

        // Total revenue for today
        const totalRevenue = todaysOrders.reduce((sum, order) =>
            sum + parseFloat(order.total_amount.toString()), 0)

        // Unique customers today
        const uniqueCustomers = new Set(todaysOrders.map(order => order.customer_name)).size

        // Total orders today
        const totalOrders = todaysOrders.length

        // Hourly revenue data for today
        const hourlyRevenueData = todaysOrders.reduce((acc, order) => {
            const hour = new Date(order.created_at).getHours()
            const existingHour = acc.find(item => item.hour === hour)

            if (existingHour) {
                existingHour.revenue += parseFloat(order.total_amount.toString())
            } else {
                acc.push({
                    hour: hour,
                    revenue: parseFloat(order.total_amount.toString())
                })
            }

            return acc
        }, [] as { hour: number, revenue: number }[])
            .sort((a, b) => a.hour - b.hour)
            .map(item => ({
                hour: `${item.hour}:00`,
                revenue: item.revenue
            }))

        return {
            totalRevenue,
            uniqueCustomers,
            totalOrders,
            hourlyRevenueData
        }
    }, [orders])

    return (
        <Card className="col-span-4">
            <CardHeader className='py-4'>
                <CardTitle className='text-lg'>Today's Statistics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <div className='flex items-center space-x-2'>
                            <div className='bg-green-500/10 rounded-md p-1'>
                                <DollarSign className="w-4 h-4 text-green-500" />
                            </div>
                            <p className="text-md font-medium">Rs. {stats.totalRevenue.toFixed(2)}</p>
                        </div>
                        <div className='flex items-center'>
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                        </div>
                    </div>
                    <div>
                        <div className='flex items-center space-x-2'>
                            <div className='bg-red-500/10 rounded-md p-1'>
                                <Users className="w-4 h-4 text-red-500" />
                            </div>
                            <p className="text-md font-medium">{stats.uniqueCustomers}</p>
                        </div>
                        <div className='flex items-center'>
                            <p className="text-sm font-medium text-gray-500">Unique Customers</p>
                        </div>
                    </div>
                    <div>
                        <div className='flex items-center space-x-2'>
                            <div className='bg-blue-500/10 rounded-md p-1'>
                                <ShoppingBag className="w-4 h-4 text-blue-500" />
                            </div>
                            <p className="text-md font-medium">{stats.totalOrders}</p>
                        </div>
                        <div className='flex items-center'>
                            <p className="text-sm font-medium text-gray-500">Total Orders</p>
                        </div>
                    </div>
                </div>
                <div className="w-full h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.hourlyRevenueData}>
                            <XAxis
                                dataKey="hour"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `Rs.${value}`}
                            />
                            <Tooltip
                                formatter={(value) => [`Rs. ${value}`, 'Revenue']}
                                contentStyle={{ backgroundColor: '#f5f5f5', border: 'none' }}
                            />
                            <Bar
                                dataKey="revenue"
                                fill='#3b82f6'
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
