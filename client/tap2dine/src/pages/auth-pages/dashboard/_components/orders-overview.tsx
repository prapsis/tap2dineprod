import { Link } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { ChevronRight } from 'lucide-react'
import { Badge } from '../../../../components/ui/badge'
import { TOrderResponseType } from '../../../../types/response.types'
import { cn } from '../../../../lib/utils'


export function OrdersOverview({data:orders}:{data:TOrderResponseType[]}) {
  // Determine status badge color
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'default'
      case 'Pending':
        return 'secondary'
      case 'Preparing':
        return 'outline'
      default:
        return 'outline'
    }
  }

  // Display only first 4 orders
  const displayedOrders = orders.slice(0, 4)

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className='text-lg'>Recent Orders</CardTitle>
        {orders.length > 4 && (
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="text-sm"
          >
            <Link to="/orders" className="flex items-center">
              View All 
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedOrders.map((order) => (
            <div 
              key={order.id} 
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <p className="font-semibold">{order.customer_name}</p>
                  <Badge 
                    variant={getStatusBadgeVariant(order.status)}
                    className={cn('text-xs', order.status === 'Pending' && 'text-yellow-600')}
                  >
                    {order.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-600">
                    Table: {order.table.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="font-medium">
                  Rs. {parseFloat(order.total_amount.toString()).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 capitalize">
                  {order.payment_method}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}