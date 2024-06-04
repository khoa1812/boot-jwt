
package com.example.demo.controller;
import com.example.demo.model.Customer;
import com.example.demo.service.ICustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/customers")
public class CustomerController {
    @Autowired
    private ICustomerService customerService;

    @GetMapping("/")
    public ResponseEntity<List<Customer>> findAll() {
        return new ResponseEntity<>(customerService.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> finOne(@PathVariable Long id) {
        Customer c = customerService.findOne(id);
        return new ResponseEntity<>(c, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody Customer customer) {
        customerService.save(customer);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

//    @DeleteMapping("/{id}")
//    public ResponseEntity<> delete(@PathVariable Long id) {
//        customerService.deleteById(id);
//        return new ResponseEntity<>(HttpStatus.ACCEPTED);
//    }
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Customer> delete(@PathVariable Long id) {
        customerService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @PutMapping
    public ResponseEntity<Customer> update(@PathVariable Long id) {
        Customer customer = customerService.findOne(id);
        customerService.save(customer);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Customer updatedCustomer) {
        Customer existingCustomer = customerService.findOne(id);
        if (existingCustomer == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        updatedCustomer.setId(id);
        customerService.save(updatedCustomer);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
