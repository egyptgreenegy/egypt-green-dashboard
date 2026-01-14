'use client'
import { CustomBreadcrumb } from '@/components/breadCrump'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useGetClientsQuery } from '@/redux/features/client/clientApi'
import { useCreateClientSubscriptionMutation, useGetSubscriptionsQuery } from '@/redux/features/subscriptions/subscriptionApi';
import { ClientSubscriptionFileds, clientSubscriptionSchema } from '@/schemas/clientSubscriptionSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Badge, Minus, Plus, User } from 'lucide-react';
import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useGetProductsQuery } from '@/redux/features/products/productApi';
import { Input } from '@/components/ui/input';
import { ComboboxFormEle } from '@/components/form/combobox-form';

const Page = () => {
    const {data:clients , isLoading:isClientLoading} = useGetClientsQuery();
    const {data:subscriptions} = useGetSubscriptionsQuery();
    const {data:products} = useGetProductsQuery();
    const [createClientSubscription , {data , isLoading}] = useCreateClientSubscriptionMutation();
    const form = useForm<ClientSubscriptionFileds>({
        resolver: zodResolver(clientSubscriptionSchema),
        defaultValues: {
            clientId: '',
            subscriptionId: '',
            paidAmount: 0,
            products: [{ productId: '', quantity: 1 }]
        }
    });
    
    // Set up field array for products
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "products"
    });
    
    const [selectedClient, setSelectedClient] = useState<string | null>(null);
    const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);
    
    const handleSubmit = async (data: ClientSubscriptionFileds) => {
        console.log(data);
        
        createClientSubscription(data);
    }
    
    // Transform clients data for combobox
    const clientOptions = clients?.data?.clients.map(client => ({
        value: `${client.id}`,
        label: client.name || client.phone || 'Unknown Client'
    })) || [];
    
    // Transform subscriptions data for combobox
    const subscriptionOptions = subscriptions?.data?.subscriptions.map(subscription => ({
        value: `${subscription.id}`,
        label: subscription.name || `Subscription #${subscription.id}`
    })) || [];
    
    // Transform products data for combobox
    const productOptions = products?.data?.products.map(product => ({
        value: `${product.id}`,
        label: product.name || `Product #${product.id}`
    })) || [];
    
    // Watch form values to update selected items
    React.useEffect(() => {
        const subscription = form.watch("subscriptionId");
        const client = form.watch("clientId");
        
        if (subscription) setSelectedSubscription(subscription);
        if (client) setSelectedClient(client);
    }, [form.watch("subscriptionId"), form.watch("clientId"), form]);
    
    // Calculate total price based on selected subscription and products
    const calculateTotal = () => {
        if (!selectedSubscription) return 0;
        
        const subscription = subscriptions?.data?.subscriptions.find(
            sub => `${sub.id}` === selectedSubscription
        );
        if (!subscription) return 0;
        let total = subscription.price || 0;
        return total;
    };
    
    return (
        <div className='flex flex-col'>
            <div className='flex-1 space-y-4 p-8'>
                <div className='mb-10'>
                    <CustomBreadcrumb
                        items={[{label:'الرئيسيه' , href:'/'} , {label:'اشتراكات العملاء', href:'/page'}]}
                    />
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 w-full">
                        {/* Client and Subscription Cards in the same row */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {/* Client Selection Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>اختيار العميل</CardTitle>
                                    <CardDescription>حدد العميل الذي تريد إضافة اشتراك له</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="client">العميل</Label>
                                        <ComboboxFormEle
                                            form={form}
                                            name="clientId"
                                            options={clientOptions}
                                            disabled={isClientLoading}
                                            placeholder="ابحث عن عميل..."
                                        />
                                    </div>
                                    {selectedClient && (
                                        <div className="pt-2">
                                            <p className="text-sm font-medium">العميل المحدد:</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span>{clientOptions.find(c => c.value === selectedClient)?.label}</span>
                                            </div>
                                            
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Subscription Selection Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>اختيار الاشتراك</CardTitle>
                                    <CardDescription>حدد نوع الاشتراك الذي تريد إضافته</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="subscription">الاشتراك</Label>
                                        <ComboboxFormEle
                                            form={form}
                                            name="subscriptionId"
                                            options={subscriptionOptions}
                                            placeholder="ابحث عن اشتراك..."
                                        />
                                    </div>
                                    {selectedSubscription && (
                                        <div className="pt-2">
                                            <p className="text-sm font-medium">الاشتراك المحدد:</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge className="h-4 w-4 text-muted-foreground" />
                                                <span>{subscriptionOptions.find(s => s.value === selectedSubscription)?.label}</span>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Products Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>المنتجات</CardTitle>
                                <CardDescription>أضف المنتجات والكميات المطلوبة للاشتراك</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="flex items-end gap-4">
                                            <div className="flex-1">
                                                <Label htmlFor={`products.${index}.productId`}>المنتج</Label>
                                                <ComboboxFormEle
                                                    form={form}
                                                    name={`products.${index}.productId`}
                                                    options={productOptions}
                                                    placeholder="اختر منتج..."
                                                />
                                            </div>
                                            <div className="w-24">
                                                <Label htmlFor={`products.${index}.quantity`}>الكمية</Label>
                                                <Input
                                                    type="number"
                                                    id={`products.${index}.quantity`}
                                                    {...form.register(`products.${index}.quantity`, {
                                                        valueAsNumber: true,
                                                        min: 1
                                                    })}
                                                    min={1}
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => fields.length > 1 && remove(index)}
                                                className="mb-0.5"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => append({ productId: '', quantity: 1 })}
                                        className="mt-2"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        إضافة منتج
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>تفاصيل الدفع</CardTitle>
                                <CardDescription>أدخل المبلغ المدفوع من قبل العميل</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-end gap-4">
                                        <div className="flex-1">
                                            <Label htmlFor="paidAmount">المبلغ المدفوع</Label>
                                            <Input
                                                type="number"
                                                id="paidAmount"
                                                {...form.register("paidAmount", {
                                                    valueAsNumber: true,
                                                    min: 0
                                                })}
                                                min={0}
                                                placeholder="أدخل المبلغ المدفوع"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className='flex justify-end'>
                            {selectedSubscription && (
                                <Card className="w-auto">
                                    <CardContent className="pt-6">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-medium">إجمالي السعر:</span>
                                                <span className="text-xl font-bold">{calculateTotal()} ريال</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-medium">المبلغ المدفوع:</span>
                                                <span className="text-xl font-bold">{form.watch("paidAmount") || 0} ريال</span>
                                            </div>
                                            <div className="flex items-center justify-between border-t pt-2 mt-1">
                                                <span className="text-lg font-medium">المبلغ المتبقي:</span>
                                                <span className="text-xl font-bold">{Math.max(0, Number(calculateTotal()) - (form.watch("paidAmount") || 0))} ريال</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                        
                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'جاري الإضافة...' : 'إضافة الاشتراك'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default Page
