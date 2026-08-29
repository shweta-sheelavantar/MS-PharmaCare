package com.auth.service;

import com.auth.entity.Order;
import com.auth.entity.OrderItem;
import com.auth.entity.Product;
import com.auth.entity.User;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class InvoiceService {

    public byte[] generateInvoice(Order order) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Header Section
            Table headerTable = new Table(UnitValue.createPercentArray(new float[]{1, 1})).useAllAvailableWidth();
            
            Cell leftHeader = new Cell().add(new Paragraph("MS PharmCare")
                    .setBold().setFontSize(20).setFontColor(new DeviceRgb(41, 128, 185)))
                    .setBorder(com.itextpdf.layout.borders.Border.NO_BORDER);
            leftHeader.add(new Paragraph("Your Trusted Online Pharmacy\ncontact@mspharmcare.com\n+91 9876543210")
                    .setFontSize(10).setFontColor(new DeviceRgb(100, 100, 100)));
            
            Cell rightHeader = new Cell().add(new Paragraph("INVOICE")
                    .setBold().setFontSize(20).setTextAlignment(TextAlignment.RIGHT))
                    .setBorder(com.itextpdf.layout.borders.Border.NO_BORDER);
            rightHeader.add(new Paragraph("Invoice No: INV-" + order.getOrderId() + "\nDate: " + 
                    order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")))
                    .setFontSize(10).setTextAlignment(TextAlignment.RIGHT));

            headerTable.addCell(leftHeader);
            headerTable.addCell(rightHeader);
            document.add(headerTable);

            document.add(new Paragraph("\n"));

            // Customer Details Section
            User user = order.getUser();
            document.add(new Paragraph("Billed To:").setBold().setFontSize(12));
            document.add(new Paragraph(user.getUserName() + "\n" + user.getEmail() + "\n" + order.getShippingAddress())
                    .setFontSize(10));
            document.add(new Paragraph("\n"));

            // Order Details
            Table detailsTable = new Table(UnitValue.createPercentArray(new float[]{1, 1})).useAllAvailableWidth();
            detailsTable.addCell(new Cell().add(new Paragraph("Order ID: " + order.getOrderId())).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
            detailsTable.addCell(new Cell().add(new Paragraph("Payment Method: " + order.getPaymentMethod())).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
            detailsTable.addCell(new Cell().add(new Paragraph("Payment Status: " + order.getPaymentStatus())).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
            detailsTable.addCell(new Cell().add(new Paragraph("Order Status: " + order.getStatus())).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
            document.add(detailsTable);
            document.add(new Paragraph("\n"));

            // Items Table
            Table table = new Table(UnitValue.createPercentArray(new float[]{4, 2, 2, 2})).useAllAvailableWidth();
            table.addHeaderCell(createHeaderCell("Product Description"));
            table.addHeaderCell(createHeaderCell("Unit Price"));
            table.addHeaderCell(createHeaderCell("Quantity"));
            table.addHeaderCell(createHeaderCell("Total"));

            for (OrderItem item : order.getItems()) {
                Product product = item.getProduct();
                table.addCell(createCell(product != null ? product.getName() : "Unknown Product"));
                table.addCell(createCell("₹" + String.format("%.2f", item.getPricePerUnit())));
                table.addCell(createCell(String.valueOf(item.getQuantity())));
                table.addCell(createCell("₹" + String.format("%.2f", item.getTotalPrice())));
            }
            document.add(table);
            document.add(new Paragraph("\n"));

            // Totals
            Table totalsTable = new Table(UnitValue.createPercentArray(new float[]{8, 2})).useAllAvailableWidth();
            
            Double subTotal = order.getItems().stream().mapToDouble(OrderItem::getTotalPrice).sum();
            totalsTable.addCell(createCell("Subtotal", TextAlignment.RIGHT).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
            totalsTable.addCell(createCell("₹" + String.format("%.2f", subTotal), TextAlignment.RIGHT).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));

            if (order.getDiscount() != null && order.getDiscount() > 0) {
                totalsTable.addCell(createCell("Discount", TextAlignment.RIGHT).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
                totalsTable.addCell(createCell("-₹" + String.format("%.2f", order.getDiscount()), TextAlignment.RIGHT).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
            }
            if (order.getGst() != null && order.getGst() > 0) {
                totalsTable.addCell(createCell("GST", TextAlignment.RIGHT).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
                totalsTable.addCell(createCell("₹" + String.format("%.2f", order.getGst()), TextAlignment.RIGHT).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
            }
            if (order.getDeliveryCharge() != null && order.getDeliveryCharge() > 0) {
                totalsTable.addCell(createCell("Delivery Charge", TextAlignment.RIGHT).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
                totalsTable.addCell(createCell("₹" + String.format("%.2f", order.getDeliveryCharge()), TextAlignment.RIGHT).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
            }
            
            totalsTable.addCell(createCell("Grand Total", TextAlignment.RIGHT).setBold().setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
            totalsTable.addCell(createCell("₹" + String.format("%.2f", order.getTotalAmount()), TextAlignment.RIGHT).setBold().setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
            
            document.add(totalsTable);

            // Footer
            document.add(new Paragraph("\n\nThank you for shopping with MS PharmCare!")
                    .setItalic().setTextAlignment(TextAlignment.CENTER).setFontColor(new DeviceRgb(100, 100, 100)));

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return baos.toByteArray();
    }

    private Cell createHeaderCell(String text) {
        return new Cell().add(new Paragraph(text).setBold().setFontColor(com.itextpdf.kernel.colors.ColorConstants.WHITE))
                .setBackgroundColor(new DeviceRgb(41, 128, 185))
                .setTextAlignment(TextAlignment.CENTER)
                .setPadding(5);
    }

    private Cell createCell(String text) {
        return new Cell().add(new Paragraph(text))
                .setTextAlignment(TextAlignment.CENTER)
                .setPadding(5);
    }

    private Cell createCell(String text, TextAlignment alignment) {
        return new Cell().add(new Paragraph(text))
                .setTextAlignment(alignment)
                .setPadding(5);
    }
}
