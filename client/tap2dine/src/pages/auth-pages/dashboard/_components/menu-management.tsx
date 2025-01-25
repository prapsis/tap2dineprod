import { Plus, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Link, useNavigate } from 'react-router'
import { TDishResponseType } from '../../../../types/response.types'

export function MenuManagement({data:dishes}:{data:TDishResponseType[]}) {
  const navigate = useNavigate();

  // Limit to 5 dishes
  const displayedDishes = dishes?.slice(0, 5)

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className='text-lg'>Menu Management</CardTitle>
        <Button 
          size="sm" 
          className='text-sm' 
          onClick={() => navigate('/menu/add-dish')}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Dish
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedDishes.map((dish) => (
            <div 
              key={dish.id} 
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <div>
                <p className="font-semibold">{dish.name}</p>
                <p className="text-sm text-gray-600">
                  {dish.category.name} | {dish.description}
                </p>
              </div>
              <p className="font-medium">Rs. {(Number(dish.price)).toFixed(2)}</p>
            </div>
          ))}
          
          {dishes.length > 5 && (
            <div className="mt-4 flex justify-center">
              <Button 
                variant="outline" 
                asChild
                className="w-full"
              >
                <Link to="/menu" className="flex items-center justify-center">
                  View All Dishes 
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}