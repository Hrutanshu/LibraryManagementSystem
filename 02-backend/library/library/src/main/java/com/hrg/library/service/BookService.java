package com.hrg.library.service;

import com.hrg.library.DAO.BookRepository;
import com.hrg.library.DAO.CheckoutRepository;
import com.hrg.library.DAO.HistoryRepository;
import com.hrg.library.DAO.PaymentRepository;
import com.hrg.library.ResponseModels.ShelfCurrentLoansResponse;
import com.hrg.library.entity.Book;
import com.hrg.library.entity.Checkout;
import com.hrg.library.entity.History;
import com.hrg.library.entity.Payment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BookService {

    private BookRepository bookRepository;
    private CheckoutRepository checkoutRepository;
    private PaymentRepository paymentRepository;
    private HistoryRepository historyRepository;

    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository,
                       HistoryRepository historyRepository, PaymentRepository paymentRepository) {
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
        this.historyRepository = historyRepository;
        this.paymentRepository = paymentRepository;
    }

    public Book checkoutBook(String userEmail, Long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if(!book.isPresent() || validateCheckout != null || book.get().getCopiesAvailable() <= 0)
            throw new Exception("Book doesn't exist or already checked out by user");

        List<Checkout> cuurentBooksCheckedOut = checkoutRepository.findBooksByUserEmail(userEmail);
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        boolean booksNeedReturned = false;
        for(Checkout checkout: cuurentBooksCheckedOut) {
            LocalDate d1 = LocalDate.parse(checkout.getReturnDate(), dtf);
            LocalDate d2 = LocalDate.parse(LocalDate.now().toString(), dtf);
            Period difference = Period.between(d2, d1);
            int days = difference.getDays();
            if(days < 0) {
                booksNeedReturned = true;
                break;
            }
        }
        Payment payment = paymentRepository.findByUserEmail(userEmail);
        if((payment != null && payment.getAmount() > 0) || (payment != null && booksNeedReturned))
           throw new Exception("Outstanding fees");

        if (payment == null) {
            Payment paymentNew = new Payment();
            paymentNew.setAmount(00.00);
            paymentNew.setUserEmail(userEmail);
            paymentRepository.save(paymentNew);
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        bookRepository.save(book.get());

        Checkout checkout = new Checkout(userEmail, LocalDate.now().toString(), LocalDate.now().plusDays(7).toString(), bookId);
        checkoutRepository.save(checkout);

        return book.get();
    }

    public boolean checkoutBookByUser(String userEmail, Long bookId) {
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if(validateCheckout != null)
            return true;
        return false;
    }

    public int currentLoansCount(String userEmail) {
        return checkoutRepository.findBooksByUserEmail(userEmail).size();
    }

    public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception {

        List<ShelfCurrentLoansResponse> shelfCurrentLoansResponses = new ArrayList<>();
        List<Checkout> checkouts = checkoutRepository.findBooksByUserEmail(userEmail);
        List<Long> bookIds = new ArrayList<>();

        for (Checkout i: checkouts) {
            bookIds.add(i.getBookId());
        }

        List<Book> books = bookRepository.findBooksByBookIds(bookIds);
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        for(Book book: books) {
            Optional<Checkout> checkout = checkouts.stream().filter(x -> x.getBookId() == book.getId()).findFirst();
            if(checkout.isPresent()) {
                LocalDate d1 = LocalDate.parse(checkout.get().getReturnDate(), dtf);
                LocalDate d2 = LocalDate.parse(LocalDate.now().toString(), dtf);
                Period difference = Period.between(d2, d1);
                shelfCurrentLoansResponses.add(new ShelfCurrentLoansResponse(book, difference.getDays()));
            }
        }
        return shelfCurrentLoansResponses;
    }

    public void returnBook(String userEmail, Long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if(!book.isPresent() || validateCheckout == null)
            throw new Exception("Book doesn't exist or not checked out by user");

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);
        bookRepository.save(book.get());

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate d1 = LocalDate.parse(validateCheckout.getReturnDate(), dtf);
        LocalDate d2 = LocalDate.parse(LocalDate.now().toString(), dtf);
        Period difference = Period.between(d2, d1);
        if(difference.getDays() < 0) {
            Payment payment = paymentRepository.findByUserEmail(userEmail);
            payment.setAmount(payment.getAmount() + (difference.getDays() * -1 * 24));
            paymentRepository.save(payment);
        }

        checkoutRepository.deleteById(validateCheckout.getId());
        History history = new History(userEmail, validateCheckout.getCheckoutDate(), LocalDate.now().toString(),
                book.get().getTitle(), book.get().getAuthor(), book.get().getDescription(), book.get().getImg());
        historyRepository.save(history);
    }

    public void renewLoan(String userEmail, Long bookId) throws Exception {
        Checkout checkout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if(checkout == null)
            throw new Exception("Book does not exist or not checked out by user");
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate d1 = LocalDate.parse(checkout.getReturnDate(), dtf);
        LocalDate d2 = LocalDate.parse(LocalDate.now().toString(), dtf);
        Period difference = Period.between(d2, d1);
        if(difference.getDays() >= 0) {
            checkout.setReturnDate(LocalDate.now().plusDays(7).toString());
            checkoutRepository.save(checkout);
        }
    }
}
