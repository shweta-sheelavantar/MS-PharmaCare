import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateInvoice = (order, user) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185); // Blue tone
    doc.text("MS PharmCare", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("123 Health Avenue, Medical District", 14, 30);
    doc.text("support@mspharmcare.com | +91 98765 43210", 14, 35);
    
    // Invoice details
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("INVOICE", 150, 22);
    
    doc.setFontSize(10);
    doc.text(`Order ID: ${order.orderId}`, 150, 30);
    doc.text(`Date: ${new Date(order.createdAt || order.orderDate).toLocaleDateString()}`, 150, 35);
    doc.text(`Payment: ${order.paymentMethod}`, 150, 40);

    // Bill To
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Bill To:", 14, 50);
    doc.setFontSize(10);
    doc.text(user?.username || user?.name || "Customer", 14, 56);
    
    const addressLines = doc.splitTextToSize(order.shippingAddress || order.deliveryAddress || "", 80);
    doc.text(addressLines, 14, 62);

    // Table
    const tableColumn = ["Item", "Quantity", "Price", "Total"];
    const tableRows = [];

    const items = order.items || order.products || [];
    items.forEach(item => {
        const itemData = [
            item.product ? item.product.name : (item.name || "Product"),
            item.quantity,
            `Rs. ${item.pricePerUnit}`,
            `Rs. ${item.totalPrice}`
        ];
        tableRows.push(itemData);
    });

    doc.autoTable({
        startY: 85,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] }
    });

    // Summary
    const finalY = doc.lastAutoTable.finalY + 10;
    
    doc.text("Summary", 130, finalY);
    
    let currentY = finalY + 6;
    
    doc.setFontSize(10);
    const subtotal = order.totalAmount - (order.deliveryCharge || 0) - (order.platformFee || 0) + (order.discount || 0);
    
    doc.text(`Subtotal: Rs. ${subtotal.toFixed(2)}`, 130, currentY);
    currentY += 6;
    
    if (order.discount > 0) {
        doc.text(`Discount: -Rs. ${order.discount.toFixed(2)}`, 130, currentY);
        currentY += 6;
    }
    if (order.deliveryCharge > 0) {
        doc.text(`Delivery: Rs. ${order.deliveryCharge.toFixed(2)}`, 130, currentY);
        currentY += 6;
    }
    if (order.platformFee > 0) {
        doc.text(`Platform Fee: Rs. ${order.platformFee.toFixed(2)}`, 130, currentY);
        currentY += 6;
    }
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Grand Total: Rs. ${order.totalAmount.toFixed(2)}`, 130, currentY + 4);
    
    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Thank you for choosing MS PharmCare!", 105, 280, null, null, "center");

    doc.save(`Invoice_${order.orderId}.pdf`);
};
