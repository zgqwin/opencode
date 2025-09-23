export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
}

export class CustomerModel {
  private customers: Customer[] = []

  add(customer: Omit<Customer, "id">): Customer {
    const newCustomer = { ...customer, id: Date.now().toString() }
    this.customers.push(newCustomer)
    return newCustomer
  }

  getAll(): Customer[] {
    return this.customers
  }

  getById(id: string): Customer | undefined {
    return this.customers.find((c) => c.id === id)
  }

  update(id: string, updates: Partial<Omit<Customer, "id">>): Customer | null {
    const customer = this.getById(id)
    if (!customer) return null
    Object.assign(customer, updates)
    return customer
  }

  delete(id: string): boolean {
    const index = this.customers.findIndex((c) => c.id === id)
    if (index === -1) return false
    this.customers.splice(index, 1)
    return true
  }
}
