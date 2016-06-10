describe('Data is loaded', function () {
	it('should show a bunch of data', function (){
		browser.get('http://localhost:5000');
		var contacts = element.all(by.repeater('contact in contactlist'));
		expect(contacts.count()).toEqual(8);
	});
});