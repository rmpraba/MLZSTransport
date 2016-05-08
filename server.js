var express    = require("express");
 var mysql      = require('mysql');
 var email   = require("emailjs/email");
 var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : 'admin',
   database : 'transport'
 });
var bodyParser = require('body-parser');
 var app = express();

app.use(express.static('app'));
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', function (req, res) {
   res.sendFile("app/index.html" );
})

app.post('/mailsend', urlencodedParser,function (req, res) {
var receiptno=req.query.receiptno;
var today=req.query.today;
var studname=req.query.studname;
var classname=req.query.classname;
var parentname=req.query.parentname;
var session=req.query.session;
var installtype=req.query.installtype;
var installfee=req.query.installfee;
var parentemail=req.query.parentemail;
  var mode=req.query.paymode;
  var words=req.query.word;
  var receipttitle=req.query.title;
console.log(parentemail);
var server  = email.server.connect({
   user:    "srirupikaallias@yahoo.com",
   password:"choculate",
   host:    "smtp.mail.yahoo.com",
   ssl:     true

});
// send the message and get a callback with an error or details of the message that was sent
server.send({
   text:    "FEE RECEIPT/ACKNOWLEDGEMENT",
   from:    "srirupikaallias@yahoo.com",
   to:       "ntamilselvimca@gmail.com",
   subject: "FEE RECEIPT/ACKNOWLEDGEMENT",
    attachment:

      [
        {data:"<html><body class='receipt'><table><caption style='text-align: center;'><strong>FEE "+receipttitle+"</strong></caption></caption>" +
        "<tr><td class='left1'><strong>Receipt No : </strong>"+receiptno+"</td><td style='width: 110px;' class='center1'></td><td class='right1'><strong>Receipt Date : </strong>"+today+"</td></tr>" +
        "<tr><td class='left1'><strong>Student Name : </strong>"+studname+"</td><td class='center1'></td><td class='right1'><strong>Class : </strong>"+classname+"</td></tr>" +
        "<tr><td class='left1'><strong>Parent Name : </strong>"+parentname+"</td><td class='center1'></td><td class='right1'><strong>Session : </strong>"+session+"</td></tr></table>" +
        "<table><tr><td style='width: 50px; text-align: center;' class='left2'><strong>SL.No</strong></td><td style='width: 280px; text-align: center;' class='center2'><strong>Particulars</strong></td><td style='text-align: right;' class='right2'><strong>Amount</strong></td></tr>" +
        "<tr><td class='left2' style='text-align: center;'>1.</td><td class='center2' style='text-align: center;'><strong>Transportfee : </strong>"+installtype+"</td><td class='right2'style='text-align: center;'>"+installfee+"</td></tr></table>" +
        "<table><tr><td class='left3'><strong>In Words : </strong>"+words+"</td><td class='right3'><strong>Total :</strong>"+installfee+"</td></tr>" +
        "<tr><td class='left3'><strong>Mode of Payments : </strong>"+mode+"</td><td class='right3'></td></tr></table>" +
        "<div class='terms'><div class='head'><strong><U>TERMS AND CONDITIONS</U></strong></div>" +
        "<div class='body'><p>1.  In Case the cheque is not honoured by the bank, service charge of Rs.250/- will <br>be levied and the amount has to be paid by Cash / DD.</p>" +
        "<p>2.  Fees once paid will not be refunded at any given circumstances.</p>" +
        "<p>3.  Cheque Subject to realization.</p>" +
        "<p>4.  Please retain this receipt for future correspondence.</p></div>" +
        "<div class='foot'><strong>THIS IS SYSTEM GENERATED RECEIPT, NO SIGNATURE IS REQUIRED.</strong></div></div></body></html>", alternative:true}

   ]
}, function(err, message) { console.log(err || message); });
res.status(200).json('mail sent');

});
app.post('/checkschool-card',  urlencodedParser,function (req, res)
{
	var id={"id":req.query.username};

       connection.query('SELECT name from md_school where id=(select school_id from employee where ?) ',[id],
       	function(err, rows)
       	{
		if(!err)
		{
		if(rows.length>0)
		{

			res.status(200).json({'returnval': rows});
		}
		else
		{

			res.status(200).json({'returnval': 'invalid'});
		}
	}
});
	});

//select the username and password from login table
app.post('/login-card',  urlencodedParser,function (req, res)
{
	var id={"id":req.query.username};
	var username={"id":req.query.username};
    var password={"password":req.query.password};
       connection.query('SELECT role_name,(select school_id from employee where ?) as school,(select name from md_school where id=school) as name ,(select address from md_school where id=school) as addr from role where id=(select role_id from employee where ? and ?) ',[id,username,password],
       	function(err, rows)
       	{
		if(!err)
		{
		if(rows.length>0)
		{

			res.status(200).json({'returnval': rows});
		}
		else
		{

			res.status(200).json({'returnval': 'invalid'});
		}
	}
});
	});

//select the route

app.post('/getroute' ,  urlencodedParser,function (req, res)
{
		var schoolx={"school_id":req.query.schol};
	    connection.query('select route_name from route where ?',[schoolx],
       	function(err, rows)
       	{
      	if(!err)
		{
			if(rows.length>0)
			{
				//console.log(rows);
			res.status(200).json({'returnval': rows});
			}
			else
			{
			res.status(200).json({'returnval': 'invalid'});
			}
		}
		else
		{
			console.log('No data Fetched'+err);
		}
});
	});



app.post('/getroutedetail' ,  urlencodedParser,function (req, res)
{
	var routename={"route_name":req.query.routename};
	var trip={"trip":req.query.tripnos};
	var schoolx={"school_id":req.query.schol};
	//console.log('hello trip...'+trip);
	connection.query('select * from point where route_id=(select id from route where ? and ?) and ?',[routename,schoolx,trip],
   	function(err, rows){
		if(!err){
			if(rows.length>0){
				//console.log(rows);
				res.status(200).json({'returnval': rows});
			} else {
				res.status(200).json({'returnval': 'invalid'});
			}
		} else{
				console.log('No data Fetched'+err);
			}
		});
});


app.post('/insertpoint' ,  urlencodedParser,function (req, res)
{

		var rouname={"id":req.query.id,"point_name":req.query.points,"route_id":req.query.routes,"trip":req.query.trip,"pickup_time":req.query.pick,"drop_time":req.query.drop,"distance_from_school":req.query.distance,"school_id":req.query.schol};
		//console.log('in server...'+routename);
		console.log(rouname);
	    connection.query('insert into point set ?',[rouname],
       	function(err, rows)
       	{
		if(!err)
		{
			console.log('inserted');
			res.status(200).json({'returnval': 'success'});
		}
		else
		{
			console.log("error");
			console.log(err);
			res.status(200).json({'returnval': 'invalid'});
		}


});
	});


app.post('/routeid' ,  urlencodedParser,function (req, res)
{
	    connection.query('select point_count from sequence',
       	function(err, rows)
       	{
		if(!err)
		{
			if(rows.length>0)
			{
				//console.log(rows);
			res.status(200).json({'returnval': rows});
			}
			else
			{
			res.status(200).json({'returnval': ''});
			}
		}
		else
		{
			console.log('No data Fetched'+err);
		}



});
	});


app.post('/sequence' ,  urlencodedParser,function (req, res)
{

		var point={"point_count":req.query.pointcount};
	    connection.query('update sequence set ?',[point],
       	function(err, rows)
       	{
      	if(!err)
		{
			if(rows.length>0)
			{

			res.status(200).json({'returnval': rows});
			}
			else
			{
			res.status(200).json({'returnval': 'invalid'});
			}
		}
		else
		{
			console.log('No data Fetched'+err);
		}
});
	});

app.post('/getzone' ,  urlencodedParser,function (req, res)
{
		var schoolx={"school_id":req.query.schol};
	    connection.query('select * from md_zone where ?',[schoolx],
       	function(err, rows)
       	{
      	if(!err)
		{
			if(rows.length>0)
			{
			res.status(200).json({'returnval': rows});
			}
			else
			{
			res.status(200).json({'returnval': 'invalid'});
			}
		}
		else
		{
			console.log('No data Fetched'+err);
		}
});
	});



app.post('/getfee' ,  urlencodedParser,function (req, res)
{
		var schoolx={"school_id":req.query.schol};
	var zone={"zone_name":req.query.zone};
	    connection.query('select fees from md_distance where id=(select distance_id from md_zone where ? and ?)',[zone,schoolx],
       	function(err, rows)
       	{
      	if(!err)
		{
			if(rows.length>0)
			{
			res.status(200).json({'returnval': rows});
			}
			else
			{
			res.status(200).json({'returnval': 'invalid'});
			}
		}
		else
		{
			console.log('No data Fetched'+err);
		}
});
	});

app.post('/gettermdate' ,  urlencodedParser,function (req, res)
{
	var schoolx={"school_id":req.query.schol};
	var idz={"school_type":req.query.grade};
	    connection.query('select start_date,end_date from transport_details where ? and ?',[idz,schoolx],
       	function(err, rows)
       	{
      	if(!err)
		{
			if(rows.length>0)
			{
				//console.log(rows);
			res.status(200).json({'returnval': rows});
			}
			else
			{
			res.status(200).json({'returnval': 'invalid'});
			}
		}
		else
		{
			console.log('No data Fetched'+err);
		}
});
	});

app.post('/setzone' ,  urlencodedParser,function (req, res)
{
	var queryy="insert into student_fee values('"+req.query.schol+"','"+req.query.studid+"','"+req.query.zone+"','','',0,0,'"+req.query.fee+"',0,'','','','',STR_TO_DATE('"+req.query.fromdate+"','%Y/%m/%d'),STR_TO_DATE('"+req.query.todate+"','%Y/%m/%d'),'"+req.query.mode+"','"+req.query.name+"',STR_TO_DATE('"+req.query.today+"','%Y/%m/%d'),'"+req.query.status+"','','',0,0)";
	   // console.log(queryy);
	    connection.query(queryy,
       	function(err, rows)
       	{


			if(!err)
			{
			res.status(200).json({'returnval': 'success'});
			}
			else
			{
				console.log(err);
			res.status(200).json({'returnval': 'invalid'});
			}

});
	});

app.post('/getstd' ,  urlencodedParser,function (req, res)
{
	    connection.query('select distinct class from class_details ',
       	function(err, rows)
       	{
      	if(!err)
		{
			if(rows.length>0)
			{
			res.status(200).json({'returnval': rows});
			}
			else
			{
			res.status(200).json({'returnval': 'invalid'});
			}
		}
		else
		{
			console.log('No data Fetched'+err);
		}
});
	});



app.post('/getsec' ,  urlencodedParser,function (req, res)
{
		var std={"class":req.query.std};
	    connection.query('select section from class_details where ?',[std],
       	function(err, rows)
       	{
      	if(!err)
		{
			if(rows.length>0)
			{
			res.status(200).json({'returnval': rows});
			}
			else
			{
			res.status(200).json({'returnval': 'invalid'});
			}
		}
		else
		{
			console.log('No data Fetched'+err);
		}
});
	});



app.post('/getname' ,  urlencodedParser,function (req, res)
{
		var schoolx={"school_id":req.query.schol};
		var trans_req={"transport_required":"yes"};
	    connection.query('select student_name from student_details where ? and ?',[trans_req,schoolx],
       	function(err, rows)
       	{
      	if(!err)
		{
			if(rows.length>0)
			{
			//console.log(rows);
			res.status(200).json({'returnval': rows});
			}
			else
			{
			res.status(200).json({'returnval': 'invalid'});
			}
		}
		else
		{
			console.log('No data Fetched'+err);
		}
});
	});


app.post('/stupassgetname' ,  urlencodedParser,function (req, res)
{
		var schoolx={"school_id":req.query.schol};
		var trans_req={"transport_required":"yes"};
	    connection.query('select student_name from student_details where id in (select student_id from student_point)and ? and ?',[trans_req,schoolx],
       	function(err, rows)
       	{
      	if(!err)
		{
			if(rows.length>0)
			{
			//console.log(rows);
			res.status(200).json({'returnval': rows});
			}
			else
			{
			res.status(200).json({'returnval': 'invalid'});
			}
		}
		else
		{
			console.log('No data Fetched'+err);
		}
});
	});


app.post('/getstudetail' ,  urlencodedParser,function (req, res)
{
		var schoolx={"school_id":req.query.schol};
		var id={"student_name":req.query.studid};
	    connection.query('select * from student_details where ? and ?',[id,schoolx],
       	function(err, rows)
       	{
      	if(!err)
		{
			if(rows.length>0)
			{

			res.status(200).json({'returnval': rows});
			}
			else
			{
			res.status(200).json({'returnval': 'invalid'});
			}
		}
		else
		{
			console.log('No data Fetched'+err);
		}
});
	});



app.post('/getroute' ,  urlencodedParser,function (req, res)
{
	    connection.query('select route_name from md_route',
       	function(err, rows)
       	{
      	if(!err)
		{
			if(rows.length>0)
			{
			res.status(200).json({'returnval': rows});
			}
			else
			{
			res.status(200).json({'returnval': 'invalid'});
			}
		}
		else
		{
			console.log('No data Fetched'+err);
		}
});
	});

app.post('/report-card',  urlencodedParser,function (req, res)
{

	var stu_id={"id":req.query.studid};
	var class_id={"class_id":req.query.studid};
	var stu_name={"student_name":req.query.studid};
       connection.query('SELECT s.id,s.student_name,s.school_type,(select class from class_details where id=s.class_id) as class_id,(select section from class_details where id=s.class_id) as section,s.photo,s.dob,s.transport_required,z.zone_id,z.fees,z.discount_fee,z.fees-z.discount_fee as actualfee ,z.installment_1+z.installment_2 as total, (z.fees-z.discount_fee)-(z.installment_1+z.installment_2) as due,(select point_name from point where id=(select pickup_point from student_point where student_id=s.id)) as pick,(select point_name from point where id=(select drop_point from student_point where student_id=s.id)) as drop1  from student_details s left join student_fee z on s.id=z.student_id where id in(select id from student_details where ? or ? or ? )',[stu_id,class_id,stu_name],
       	function(err, rows)
       	{
		if(!err)
		{
		if(rows.length>0)
		{
			//console.log(rows);
			res.status(200).json({'returnval': rows});
		}
		else
		{
			console.log(err);
			res.status(200).json({'returnval': 'invalid'});
		}
	}
});
	});





app.post('/selectclass',  urlencodedParser,function (req, res)
{

       connection.query('SELECT distinct school_type from student_details',
       	function(err, rows)
       	{
		if(!err)
		{
		if(rows.length>0)
		{
			res.status(200).json({'returnval': rows});
		}
		else
		{
			res.status(200).json({'returnval': 'invalid'});
		}
	}
});
	});

app.post('/selectnameforpoint',  urlencodedParser,function (req, res)
{ var schoolx={"school_id":req.query.schol};

       connection.query('SELECT id, student_name from student_details where id in(select student_id from student_fee where ?) and id not in (Select student_id from student_point)',[schoolx],
       	function(err, rows)
       	{
		if(!err)
		{
		if(rows.length>0)
		{
			res.status(200).json({'returnval': rows});
		}
		else
		{
			res.status(200).json({'returnval': 'invalid'});
		}
	}
});
	});
app.post('/classpick',  urlencodedParser,function (req, res)
{
	var schoolx={"school_id":req.query.schol};
	var class_id={"school_type":req.query.classes};
	var req={"transport_required":'yes'};
		//console.log('in server...');
      	connection.query('select id , student_name from student_details where id in(select student_id from student_fee where student_id not in (Select student_id from student_point) and (installment_1>0 or fees-discount_fee=0))and ? and ? and ?',[class_id,req,schoolx],
       		function(err, rows)
       	{
		if(!err)
		{
		if(rows.length>0)
		{
			res.status(200).json({'returnval': rows});
		}
		else
		{
			res.status(200).json({'returnval': ''});
		}
	}

});
	});

app.post('/namepick',  urlencodedParser,function (req, res)
{
	var id={"id":req.query.id};
	var req1={"transport_required":'yes'};
	var schoolx={"school_id":req.query.schol};
		console.log(req.query.schol);
      	connection.query('select id , student_name from student_details where id in(select student_id from student_fee where student_id not in (Select student_id from student_point) and (installment_1>0 or fees-discount_fee=0))and ? and ? and ?',[id,req1,schoolx],
       		function(err, rows)
       	{
		if(!err)
		{
		if(rows.length>0)
		{
			res.status(200).json({'returnval': rows});
			//console.log(rows);
		}
		else
		{
			res.status(200).json({'returnval': ''});
		}
	}

});
	});
app.post('/pickpoints',  urlencodedParser,function (req, res)
{
		var route_id=req.query.routept;
		var studid=req.query.studid;
		var schoolx=req.query.schol;
		console.log(req.query.schol);
       connection.query('SELECT id, point_name from point where route_id=? and school_id=? and distance_from_school<=(select maxdistance from md_distance where id=(select distance_id from md_zone where id=(select zone_id from student_fee where student_id=?)))',[route_id,schoolx,studid],
       	function(err, rows)
       	{
		if(!err)
		{
		if(rows.length>0)
		{
			//console.log(rows);
			res.status(200).json({'returnval': rows});
		}
		else
		{

			res.status(200).json({'returnval': 'invalid'});
		}
	}
	else
	{
		console.log(err);
	}
});
});
app.post('/routedroppoint',  urlencodedParser,function (req, res)
{
		var route_id=req.query.routedroppt;
		var studid=req.query.studid;
		var schoolx={"school_id":req.query.schol};
       connection.query('SELECT id, point_name from point where route_id=? and distance_from_school<=(select maxdistance from md_distance where id=(select distance_id from md_zone where id=(select zone_id from student_fee where student_id=? and ?)))',[route_id,studid,schoolx],
       	function(err, rows)
       	{
		if(!err)
		{
		if(rows.length>0)
		{
			res.status(200).json({'returnval': rows});
		}
		else
		{
			res.status(200).json({'returnval': 'invalid'});
		}
	}
});
});
app.post('/routepoint',  urlencodedParser,function (req, res)
{
		var schoolx={"school_id":req.query.schol};
       connection.query('SELECT * from route where ?',[schoolx],
       	function(err, rows)
       	{
		if(!err)
		{
		if(rows.length>0)
		{

			res.status(200).json({'returnval': rows});

		}
		else
		{
			res.status(200).json({'returnval': 'invalid'});
		}
	}
});
});

app.post('/submiturl',  urlencodedParser,function (req, res)
{
		var mappointtostudent={"student_id":req.query.studentid,"school_type":req.query.class_id,"pickup_route_id":req.query.pickroute,"pickup_point":req.query.pickpoint,"drop_route_id":req.query.droproute, "drop_point":req.query.droppoint,"flag":req.query.flag,"school_id":req.query.schol};
		//console.log(mappointtostudent);
	    connection.query('insert into student_point set ?',[mappointtostudent],
       	function(err, rows)
       	{
		if(!err)
		{
			res.status(200).json({'returnval': 'success'});
		}
		else
		{
			//console.log(err);
			res.status(200).json({'returnval': 'invalid'});
		}

});
	});


app.post('/gettrip' ,  urlencodedParser,function (req, res)
{

		 var routen={"route_name":req.query.triproute};
		 var schoolx={"school_id":req.query.schol};
		 //console.log('in server...');
		 //console.log(routen);
	    connection.query('select distinct trip from point where route_id=(select id from route where ? and ?)',[routen,schoolx],
       	function(err, rows)
       	{
		if(!err)
		{
			if(rows.length>0)
			{
				//console.log(rows);
			res.status(200).json({'returnval': rows});
			}
			else
			{
			res.status(200).json({'returnval': 'invalid'});
			}
		}
		else
		{
			console.log('No data Fetched'+err);
		}


});
	});

app.post('/getrouteid' ,  urlencodedParser,function (req, res)
{

		 var routen={"route_name":req.query.routename};
		 var schoolx={"school_id":req.query.schol};
		 console.log('in server...');
		 console.log(routen);
	    connection.query('select * from route where ? and ?',[routen,schoolx],
       	function(err, rows)
       	{
		if(!err)
		{
			if(rows.length>0)
			{
			console.log(rows);
			res.status(200).json({'returnval': rows});
			}
			else
			{
			res.status(200).json({'returnval': 'invalid'});
			}
		}
		else
		{
			console.log('No data Fetched'+err);
		}
});
	});

app.post('/cancellation',  urlencodedParser,function (req, res)
{

	var stu_id={"id":req.query.studid};
	var class_id={"class_id":req.query.studid};
	var stu_name={"student_name":req.query.studid};
	var schoolx={"school_id":req.query.schol};
       connection.query('SELECT s.id,s.student_name,s.class_id,s.school_type,s.photo,s.dob,s.transport_required,z.zone_id,z.fees,z.discount_fee,z.fees-z.discount_fee as actualfee ,z.installment_1+z.installment_2 as total, (z.fees-z.discount_fee)-(z.installment_1+z.installment_2) as due,(select point_name from point where id=(select pickup_point from student_point where student_id=s.id)) as pick,(select point_name from point where id=(select drop_point from student_point where student_id=s.id)) as drop1  from student_details s left join student_fee z on s.id=z.student_id where id in(select id from student_details where (? or ? or ?) and ? )',[stu_id,class_id,stu_name,schoolx],
       	function(err, rows)
       	{
		if(!err){
			if(rows.length>0)
			{
				res.status(200).json({'returnval': rows});
			} else {
				console.log(err);
				res.status(200).json({'returnval': 'invalid'});
			}
		} else {
			console.log(err);
		}
});
});
app.post('/cancel',  urlencodedParser,function (req, res){
	var school_type={"school_type":req.query.school_type};
	var end_transport=req.query.end_date;
var schoolx={"school_id":req.query.schol};
	/*var queryy="SELECT DATEDIFF(STR_TO_DATE('"+end_transport+"', '%m/%d/%Y'),start_date) AS Days_used, DATEDIFF(end_date,start_date) AS Total_days FROM transport_details where ?";*/
	var queryy="SELECT start_date, end_date FROM transport_details where ? and ?";
    connection.query(queryy,[school_type,schoolx],
		function(err, rows){
       	if(err){
       		console.log(err);
       	}
			if(!err){
				if(rows.length>0){
					res.status(200).json({'returnval': rows});
				} else {
					console.log(err);
					res.status(200).json({'returnval': 'invalid'});
				}
			}
		});
});
app.post('/proceedcancel',  urlencodedParser,function (req, res){
	var collection={"student_id":req.query.student_id,"student_name":req.query.student_name,"months_used":req.query.months_used,"refund_amount":req.query.refund_amount, "flag":3,"status":"Requested", "reason":req.query.reason, "status":'Requested',"school_id":req.query.schol};
    connection.query('insert into cancellation set ?',[collection],
	function(err, rows){

		if(!err)
			{
			res.status(200).json({'returnval': 'success'});
			}
			else
			{
				console.log(err);
			res.status(200).json({'returnval': 'invalid'});
			}
	});
	});
app.post('/transportrequiredstatus',  urlencodedParser,function (req, res)
{
	var student_id = {"id":req.query.student_id};
	var schoolx={"school_id":req.query.schol};
	var transport_required = {"transport_required":'no'};
    connection.query('update student_details set ? where ? and ?',[transport_required,student_id,schoolx],
       	function(err, rows)
       	{
       	if(err){
       		console.log(err);
       	}
		if(!err)
		{
		if(rows.length>0)
		{
			res.status(200).json({'returnval': rows});
		}
		else
		{
			console.log(err);
			res.status(200).json({'returnval': 'invalid'});
		}
	}
});
	});


app.post('/reportfee-card',  urlencodedParser,function (req, res)
{

	var schoolx={"school_id":req.query.schol};
	var stu_id={"id":req.query.studid};
	var class_id={"class_id":req.query.studid};
	var stu_name={"student_name":req.query.studid};
       connection.query('SELECT s.id,s.student_name,(select class from class_details where id=s.class_id) as class_id,s.photo,s.dob,s.transport_required,z.install1_status,z.install2_status,z.install1_fine,z.install2_fine,z.zone_id,z.fees,z.discount_fee,(z.fees-z.discount_fee)as actualfee,z.installment_1,z.installment_2,(z.installment_1+z.installment_2) as total, (z.fees-z.discount_fee)-(z.installment_1+z.installment_2) as due,(z.fees-z.discount_fee)/2 as install,z.installment_1Date,z.installment_2Date,z.modeofpayment1,z.modeofpayment2,(select point_name from point where id=(select pickup_point from student_point where student_id=s.id)) as pick,(select point_name from point where id=(select drop_point from student_point where student_id=s.id)) as drop1  from student_details s left join student_fee z on s.id=z.student_id where id in(select id from student_details where (? or ? or ?) and ? )',[stu_id,class_id,stu_name,schoolx],
       	function(err, rows)
       	{
		if(!err)
		{
		if(rows.length>0)
		{
			res.status(200).json({'returnval': rows});
		}
		else
		{
			console.log(err);
			res.status(200).json({'returnval': 'invalid'});
		}
	}
});
	});


app.post('/zonefee-card',  urlencodedParser,function (req, res)
{


	var stu_id={"id":req.query.studid};
	var class_id={"class_id":req.query.studid};
	var stu_name={"student_name":req.query.studid};
       connection.query('SELECT s.id,s.student_name,(select class from class_details where id=s.class_id) as class_id,s.photo,s.dob,s.transport_required,z.install1_status,z.install2_status,z.install1_fine,z.install2_fine,z.zone_id,z.fees,z.discount_fee,(z.fees-z.discount_fee)as actualfee,z.installment_1,z.installment_2,(z.installment_1+z.installment_2) as total, (z.fees-z.discount_fee)-(z.installment_1+z.installment_2) as due,(z.fees-z.discount_fee)/2 as install,z.installment_1Date,z.installment_2Date,z.modeofpayment1,z.modeofpayment2,(select point_name from point where id=(select pickup_point from student_point where student_id=s.id)) as pick,(select point_name from point where id=(select drop_point from student_point where student_id=s.id)) as drop1  from student_details s left join student_fee z on s.id=z.student_id where id in(select id from student_details where ? or ? or ? )',[stu_id,class_id,stu_name],
       	function(err, rows)
       	{
		if(!err)
		{
		if(rows.length>0)
		{
			res.status(200).json({'returnval': rows});
		}
		else
		{
			console.log(err);
			res.status(200).json({'returnval': 'invalid'});
		}
	}
});
	});

app.post('/getnameofstu-card',  urlencodedParser,function (req, res)
{
		var schoolx={"school_id":req.query.schol};
		//console.log(schoolx);
       connection.query('SELECT student_name from student_details where id in (select student_id from student_fee where status="mapped" and ?)',[schoolx],
       	function(err, rows)
       	{
		if(!err)
		{
		if(rows.length>0)
		{	//console.log(rows);
			res.status(200).json({'returnval': rows});
		}
		else
		{
			console.log(err);
			res.status(200).json({'returnval': 'invalid'});
		}
	}
});
	});


app.post('/payfee-card',  urlencodedParser,function (req, res)
{
		var d = new Date();
        var instalment1date=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
		var mode;
		var install1;
		var install1date;
		var paidstatus;
		var status;
		if(req.query.paytype=="Cash")
		{
         paidstatus="paid";
		}
		if(req.query.paytype=="Cheque")
		{
			paidstatus="processing"
		}
		var schoolx={"school_id":req.query.schol};
		var studid={"student_id":req.query.studid};
		if(req.query.instype=="installment1")
		{
			//console.log('yes');
		 mode={"modeofpayment1":req.query.paytype};
		 install1={"installment_1":req.query.installfee};
		 install1date={"installment_1Date":instalment1date};
		 status={"install1_status":paidstatus};
		 rec={"receipt_no1":req.query.receiptno};
	    }
	    else
	    {
	    	//console.log('no');
	    	mode={"modeofpayment2":req.query.paytype};
		 install1={"installment_2":req.query.installfee};
		 install1date={"installment_2Date":instalment1date}
		 status={"install2_status":paidstatus};
		  rec={"receipt_no2":req.query.receiptno};
	    }
	    console.log(req.query.instype);
	    console.log(studid);
	    console.log(mode);
	    console.log(install1);
	    console.log(install1date);
	    console.log(status);
	    console.log(rec);
	    connection.query('update  student_fee set ?,?,?,?,? where ? and ?',[mode,install1,install1date,status,rec,studid,schoolx],
       	function(err, rows)
       	{
		if(!err)
		{
			res.status(200).json({'returnval': 'success'});
		}
		else
		{
			console.log(err);
			res.status(200).json({'returnval': 'invalid'});
		}

});
	});
app.post('/chequedetails',  urlencodedParser,function (req, res)
{

		var studid={"school_id":req.query.schol,"student_id":req.query.studid,"name":req.query.name,"cheque_no":req.query.chequenum,"bank_name":req.query.bankname,"cheque_date":req.query.chequedate,"installtype":req.query.installtype,"cheque_status":req.query.chequestatus};
	    connection.query('insert into cheque_details  set ?',[studid],
       	function(err, rows)
       	{
		if(!err)
		{
			//console.log('dd');
			res.status(200).json({'returnval': 'success'});
		}
		else
		{
			console.log(err);
			res.status(200).json({'returnval': 'invalid'});
		}
});
	});






app.post('/refund-card',  urlencodedParser,function (req, res)
{
var schoolx={"school_id":req.query.schol};
       connection.query('SELECT student_id,student_name,refund_amount,reason,DATE_FORMAT( cancelled_date, "%d/%m/%Y" ) as cancelled_date from  cancellation where flag=3 and ?',[schoolx],
       	function(err, rows)
       	{
		if(!err)
		{
		if(rows.length>0)
		{
//console.log(rows);
			res.status(200).json({'returnval': rows});
		}
		else
		{
			console.log(err);
			res.status(200).json({'returnval': 'invalid'});
		}
	}
});
	});


app.post('/approval-card',  urlencodedParser,function (req, res)
{



		var studid={"student_id":req.query.studid};
		var schoolx={"school_id":req.query.schol};
				var vale={"status":req.query.status,"flag":req.query.flag};
		//console.log(studid);
	    connection.query('update  cancellation set ? where ? and ?',[vale,studid,schoolx],
       	function(err, rows)
       	{
		if(!err)
		{

			res.status(200).json({'returnval': 'success'});
		}
		else
		{
			console.log(err);
			res.status(200).json({'returnval': ''});
		}

});
	});

app.post('/name',  urlencodedParser,function (req, res){

	var schoolx=req.query.schol;
       connection.query('select student_id, student_name from student_details join student_fee on student_fee.student_id=student_details.id and student_details.transport_required="yes" and student_details.school_id=?',[schoolx],
       	function(err, rows)
       	{
       		if(err){
       			console.log(err);
       		}
		if(!err)
		{
		if(rows.length>0)
		{
			res.status(200).json({'returnval': rows});
		}
		else
		{
			console.log(err);
			res.status(200).json({'returnval': 'invalid'});
		}
	}
});
	});

app.post('/getfeedata' ,  urlencodedParser,function (req, res)
{
		var studid=req.query.studid;
		//console.log(studid);
	    connection.query('select student_id,zone_id,fees,from_date,to_date from student_fee where student_id=(select id from student_details where student_name=?)',[studid],
       	function(err, rows)
       	{
      	if(!err)
		{
			if(rows.length>0)
			{
			res.status(200).json({'returnval': rows});
			}
			else
			{
			res.status(200).json({'returnval': 'invalid'});
			}
		}
		else
		{
			console.log('No data Fetched'+err);
		}
});
	});


app.post('/getfeezone' ,  urlencodedParser,function (req, res)
{
		var zoneid={"id":req.query.zone};
	    connection.query('select zone_name from md_zone where ?',[zoneid],
       	function(err, rows)
       	{
      	if(!err)
		{
			if(rows.length>0)
			{
			res.status(200).json({'returnval': rows});
			}
			else
			{
			res.status(200).json({'returnval': 'invalid'});
			}
		}
		else
		{
			console.log('No data Fetched'+err);
		}
});
	});


app.post('/getfeename' ,  urlencodedParser,function (req, res)
{
		var stid={"id":req.query.sid};
	    connection.query('select student_name,school_type from student_details where ?',[stid],
       	function(err, rows)
       	{
      	if(!err)
		{
			if(rows.length>0)
			{
			res.status(200).json({'returnval': rows});
			}
			else
			{
			res.status(200).json({'returnval': 'invalid'});
			}
		}
		else
		{
			console.log('No data Fetched'+err);
		}
});
	});

app.post('/sendrequest',  urlencodedParser,function (req, res)
{

    var queryyz="insert into md_discount values('"+req.query.schol+"','"+req.query.stid+"','"+req.query.stname+"','"+req.query.schooltypezx+"','"+req.query.zoname+"',"+req.query.feesx+",STR_TO_DATE('"+req.query.fromdatx+"','%Y/%m/%d'),STR_TO_DATE('"+req.query.todatx+"','%Y/%m/%d'),'"+req.query.disamtx+"','"+req.query.reasonx+"','Requested',3,STR_TO_DATE('"+req.query.todayx+"','%Y/%m/%d'),null,null)";
	   // console.log(queryyz);
	    connection.query(queryyz,
       	function(err, rows)
       	{
		if(!err)
		{
			res.status(200).json({'returnval': 'success'});
		}
		else
		{
			console.log(err);
			res.status(200).json({'returnval': 'invalid'});
		}

});
	});




app.post('/generatereportbyname',  urlencodedParser,function (req, res)
{
		var schoolx={"school_id":req.query.schol};
       connection.query('SELECT student_name from student_details where ?',[schoolx],
       	function(err, rows)
       	{
		if(!err)
		{
		if(rows.length>0)
		{
			res.status(200).json({'returnval': rows});
		}
		else
		{
			console.log(err);
			res.status(200).json({'returnval': 'invalid'});
		}
	}
});
	});
app.post('/discountbyname',  urlencodedParser,function (req, res)
{
	var schoolx={"school_id":req.query.schol};
       connection.query('SELECT student_name from student_details where id in (select student_id from student_fee where ? and status="mapped")',[schoolx],
       	function(err, rows)
       	{
		if(!err)
		{
		if(rows.length>0)
		{
			res.status(200).json({'returnval': rows});
		}
		else
		{
			console.log(err);
			res.status(200).json({'returnval': 'invalid'});
		}
	}
});
	});


app.post('/generateroutereport',  urlencodedParser,function (req, res)
{
	var schoolx={"school_id":req.query.schol};
	connection.query('SELECT * from route where ?',[schoolx],
       	function(err, rows)
       	{
		if(!err)
		{
		if(rows.length>0)
		{
			res.status(200).json({'returnval': rows});
		}
		else
		{
			console.log(err);
			res.status(200).json({'returnval': 'invalid'});
		}
	}
});
	});

app.post('/route-report-card',  urlencodedParser,function (req, res){

	var route_id={"route_id":req.query.routeid};
    connection.query('SELECT p.route_id, p.point_name, p.pickup_time, p.drop_time,p.trip, r.route_name from point p left join route r on p.route_id=r.id where ?',[route_id],
    function(err, rows){
		if(!err){
			if(rows.length>0){
				//console.log(rows);
				res.status(200).json({'returnval': rows});
			} else {
				console.log(err);
				res.status(200).json({'returnval': 'invalid'});
			}
		} else {
			console.log(err);
		}
	});
});


app.post('/studentpickroute-report-card',  urlencodedParser,function (req, res){
	var tripid={"school_type":req.query.tripid};
	var schoolx={"school_id":req.query.schol};
		//console.log(req.query.pickordrop);
         var route_id={"pickup_route_id":req.query.routeid};

    connection.query('SELECT student_id,(select student_name from student_details where id=student_id)as name,(select point_name from point where id=pickup_point)  as pick from student_point where ? and ? and ?',[route_id,tripid,schoolx],
    function(err, rows){
		if(!err){
			if(rows.length>0){
				//console.log(rows);
				res.status(200).json({'returnval': rows});
			} else {
				console.log(err);
				res.status(200).json({'returnval': ''});
			}
		} else {
			console.log(err);
		}
	});
});

app.post('/studentdroproute-report-card',  urlencodedParser,function (req, res){
	var tripid={"school_type":req.query.tripid};
	var schoolx={"school_id":req.query.schol};
		//console.log(tripid);
         var route_id={"drop_route_id":req.query.routeid};

    connection.query('SELECT student_id,(select student_name from student_details where id=student_id)as name,(select point_name from point where id=drop_point)  as pick from student_point where ? and ? and ?',[route_id,tripid,schoolx],
    function(err, rows){
		if(!err){
			if(rows.length>0){
				res.status(200).json({'returnval': rows});
			} else {
				res.status(200).json({'returnval': ''});
			}
		} else {
			console.log(err);
		}
	});
});
app.post('/deletemappoint-card',  urlencodedParser,function (req, res)
{
//console.log('come');
	var ptarr=req.query.pointarray;
	var rtname=req.query.routenam;
	var trip1=req.query.tripnum;
	var schoolx={"school_id":req.query.schol};
//console.log('come'+ptarr);
       connection.query('delete from point where point_name in (?) and trip=? and route_id=(select id from route where route_name=? and ?)',[ptarr,trip1,rtname,schoolx],
       	function(err, rows)
       	{
		if(!err)
		{
			//console.log('suc');
			res.status(200).json({'returnval': 'success'});
		}
		else
		{
			console.log(err);
			res.status(200).json({'returnval': 'invalid'});
		}

});
});


app.post('/getstudapproval',  urlencodedParser,function (req, res)
{

		var schoolx={"school_id":req.query.schol};
	    connection.query('SELECT * from md_discount where flag=3 and ?',[schoolx],
       	function(err, rows)
       	{
		if(!err)
		{
			if(rows.length>0)
			{

			res.status(200).json({'returnval': rows});
			}
			else
			{
			res.status(200).json({'returnval': ''});
			}
		}
		else
		{
			console.log('No data Fetched'+err);
		}

});
	});


app.post('/confirmdisc',  urlencodedParser,function (req, res)
{
	var val={"stud_id":req.query.stid};
	var schoolx={"school_id":req.query.schol};
	var vari={"admin_reason":req.query.admrea,"approve_discount":req.query.accdis,"updatation":req.query.nowdate,"status":req.query.status,"flag":req.query.flag};
	    connection.query('update md_discount set ? where ? and ?',[vari,val,schoolx],
       	function(err, rows)
       	{
		if(!err)
		{
			res.status(200).json({'returnval': 'success'});
		}
		else
		{
			console.log(err);
			res.status(200).json({'returnval': 'invalid'});
		}

});
	});


app.post('/getapprovalverify',  urlencodedParser,function (req, res)
{

		var schoolx={"school_id":req.query.schol};
	    connection.query('SELECT * from md_discount where flag=2 and ?',[schoolx],
       	function(err, rows)
       	{
		if(!err)
		{
			if(rows.length>0)
			{

			res.status(200).json(rows);
			}
			else
			{
			res.status(200).json('');
			}
		}
		else
		{
			console.log('No data Fetched'+err);
		}

});
	});


app.post('/confirmedfee',  urlencodedParser,function (req, res)
{
	var schoolx={"school_id":req.query.schol};
    var val={"stud_id":req.query.stid};
	var vari={"updatation":req.query.date,"status":req.query.status,"flag":req.query.flag};
	    connection.query('update md_discount set ? where ? and ? ',[vari,val,schoolx],
       	function(err, rows)
       	{
		if(!err)
		{
			res.status(200).json({'returnval': 'success'});
		}
		else
		{
			console.log(err);
			res.status(200).json({'returnval': 'invalid'});
		}

});
	});

app.post('/confirmfee',  urlencodedParser,function (req, res)
{
	var schoolx={"school_id":req.query.schol};
    var val={"student_id":req.query.stid};
	var vari={"discount_fee":req.query.fees};
	    connection.query('update student_fee set ? where ? and ?',[vari,val,schoolx],
       	function(err, rows)
       	{
		if(!err)
		{
			res.status(200).json({'returnval': 'success'});
		}
		else
		{
			console.log(err);
			res.status(200).json({'returnval': 'invalid'});
		}

});
	});


app.post('/cancelledfee',  urlencodedParser,function (req, res)
{

    var val={"stud_id":req.query.stid};
	var vari={"status":req.query.status,"flag":req.query.flag};
	    connection.query('update md_discount set ? where ? ',[vari,val],
       	function(err, rows)
       	{
		if(!err)
		{
			res.status(200).json({'returnval': 'success'});
		}
		else
		{
			console.log(err);
			res.status(200).json({'returnval': 'invalid'});
		}

});
	});



app.post('/getverify',  urlencodedParser,function (req, res)
{
		var schoolx={"school_id":req.query.schol};
	    connection.query('SELECT * from cancellation where flag=2 and ?',[schoolx],
       	function(err, rows)
       	{
		if(!err)
		{
			if(rows.length>0)
			{
				//console.log(rows);
			res.status(200).json({'returnval': rows});
			}
			else
			{
			res.status(200).json({'returnval':'invalid'});
			}
		}
		else
		{
			console.log('No data Fetched'+err);
		}

});
	});



app.post('/getclass',  urlencodedParser,function (req, res)
{
		var schoolx={"school_id":req.query.schol};
			var id={"id":req.query.class};
	    connection.query('SELECT * from class_details where ? and ?',[id,schoolx],
       	function(err, rows)
       	{
		if(!err)
		{
			if(rows.length>0)
			{

			res.status(200).json({'returnval': rows});
			}
			else
			{
			res.status(200).json('invalid');
			}
		}
		else
		{
			console.log('No data Fetched'+err);
		}

});
	});


app.post('/statuschange',  urlencodedParser,function (req, res)
{
	var student_id = {"student_id":req.query.student_id};
	var schoolx={"school_id":req.query.schol};
	var required = {"status":'cancelled'};
    connection.query('update student_fee set ? where ? and ?',[required,student_id,schoolx],
       	function(err, rows)
       	{
       	if(err){
       		console.log(err);
       	}
		if(!err)
		{
		if(rows.length>0)
		{
			res.status(200).json({'returnval': rows});
		}
		else
		{
			console.log(err);
			res.status(200).json({'returnval': 'invalid'});
		}
	}
});
	});

app.post('/pointflag',  urlencodedParser,function (req, res)
{
	var student_id = {"student_id":req.query.student_id};
	var schoolx={"school_id":req.query.schol};
	var required = {"flag":2};
    connection.query('update student_point set ? where ? and ?',[required,student_id,schoolx],
       	function(err, rows)
       	{
       	if(err){
       		console.log(err);
       	}
		if(!err)
		{
		if(rows.length>0)
		{
			res.status(200).json({'returnval': rows});
		}
		else
		{
			console.log(err);
			res.status(200).json({'returnval': 'invalid'});
		}
	}
});
	});



app.post('/getstudzone',  urlencodedParser,function (req, res)
{
		var schoolx={"school_id":req.query.schol};
	var stuid={"student_id":req.query.stid};
	    connection.query('SELECT status from student_fee where ? and ?',[stuid,schoolx],
       	function(err, rows)
       	{
		if(!err)
		{
			if(rows.length>0)
			{
				//console.log(rows);
			res.status(200).json({'returnval': rows[0].status});
			}
			else
			{
			res.status(200).json('invalid');
			}
		}
		else
		{
			console.log('No data Fetched'+err);
		}

});
	});


app.post('/updatezone' ,  urlencodedParser,function (req, res)
{
	var queryy="update student_fee set zone_id='"+req.query.zone+"',fees='"+req.query.fee+"',from_date=STR_TO_DATE('"+req.query.fromdate+"','%Y/%m/%d'),to_date=STR_TO_DATE('"+req.query.todate+"','%Y/%m/%d'),mode='"+req.query.mode+"',updated_by='"+req.query.name+"',updated_on=STR_TO_DATE('"+req.query.today+"','%Y/%m/%d'),status='"+req.query.status+"'  WHERE student_id='"+req.query.studid+"'";
	    //console.log(queryy);
	    connection.query(queryy,
       	function(err, rows)
       	{


			if(!err)
			{
			res.status(200).json({'returnval': 'success'});
			}
			else
			{
				console.log(err);
			res.status(200).json({'returnval': 'invalid'});
			}

});
	});




app.post('/checkchequedetails',  urlencodedParser,function (req, res)
{
	var schoolx={"school_id":req.query.schol};
       connection.query('SELECT * from cheque_details where cheque_status="processing" and ?',[schoolx],
       	function(err, rows)
       	{
		if(!err)
		{
		if(rows.length>0)
		{
			res.status(200).json({'returnval': rows});
		}
		else
		{
			console.log(err);
			res.status(200).json({'returnval': ''});
		}
	}
});
	});


app.post('/updatechequedetail',  urlencodedParser,function (req, res)
{
	var cstatus={"cheque_status":req.query.chequestatus};
    var cno={"cheque_no":req.query.chequenum};
    var schoolx={"school_id":req.query.schol};
       connection.query('update cheque_details set ? where ? and ?', [cstatus,cno,schoolx],
       	function(err, rows)
       	{
		if(!err)
		{

			// console.log('cyes');
			res.status(200).json({'returnval': 'success'});

		}
		else
		{
			res.status(200).json({'returnval': 'invalid'});
		}

});
});

app.post('/updatestucheque',  urlencodedParser,function (req, res)
{
	var chequename;
	var chequestatus;
	var updatefine
	var installtype=req.query.installtype;
	var fine1=0;
	var fine2=0;
	if(installtype=="installment1")
	{
		if(req.query.paidstatus=="bounce")
		{
			fine1=250;
		}
		else
		{
			fine1=0;
		}
		chequestatus={"install1_status":req.query.paidstatus};
		//updatefine={"install1_fine":install1_fine+fine};
	}
	else
	{
		if(req.query.paidstatus=="bounce")
		{
			fine2=250;
		}
		else
		{
			fine2=0;
		}
         chequestatus={"install2_status":req.query.paidstatus};
          //updatefine={"install2_fine":install2_fine+fine};
	}

	chequename={"student_id":req.query.chequename}
       connection.query('update student_fee set ?,install1_fine=install1_fine+?,install2_fine=install2_fine+? where ?', [chequestatus,fine1,fine2,chequename],
       	function(err, rows)
       	{
		if(!err)
		{

			// console.log('ccyes');
			res.status(200).json({'returnval': 'success'});

		}
		else
		{
			console.log(err);
			res.status(200).json({'returnval': 'invalid'});
		}

});
});

app.post('/feereport',  urlencodedParser,function (req, res)
{
	var schoolx={"school_id":req.query.schol};
	var dat1={"installment_1Date":req.query.dates};
	var dat2={"installment_2Date":req.query.dates};
	console.log('come');
       connection.query('Select student_id,receipt_no1,receipt_no2,fees,installment_1,installment_2,installment_1Date,installment_2Date,modeofpayment1,modeofpayment2,(select student_name from student_details where id=student_id) as name from student_fee  where (? or ?) and ?',[dat1,dat2,schoolx],
       	function(err, rows)
       	{
		if(!err)
		{
		if(rows.length>0)
		{
			res.status(200).json({'returnval': rows});
		}
		else
		{
			console.log(err);
			res.status(200).json({'returnval': ''});
		}
	}
});
	});



app.post('/chequereport',  urlencodedParser,function (req, res)
{
	var schoolx={"school_id":req.query.schol};
	var dat1={"installment_1Date":req.query.dates};
	var dat2={"installment_2Date":req.query.dates};
	console.log('come');
       connection.query('Select * from cheque_details where student_id in (select student_id from student_fee  where (? or ?) and ?)',[dat1,dat2,schoolx],
       	function(err, rows)
       	{
		if(!err)
		{
		if(rows.length>0)
		{
			res.status(200).json({'returnval': rows});
		}
		else
		{
			console.log(err);
			res.status(200).json({'returnval': ''});
		}
	}
});
	});



app.post('/datepickinsta1',  urlencodedParser,function (req, res)
{
	var date={"installment_1Date":req.query.dates};
	var mode= {"modeofpayment1":"Cash"};
	var schoolx=req.query.schol;
	    connection.query('Select f.student_id, d.student_name, f.receipt_no, f.fees,f.installment_1 from student_fee f left join student_details d on f.student_id=d.id where ? and ? and d.school_id=?',[date, mode,schoolx],
       	function(err, rows){
       		var itemarr = new Array();
       		if(!err){
		       	if(rows.length>0){
			        for(var i=0;i<rows.length;i++){
			            var obj={"student_id":"","student_name":"","receipt_no":"","fees":"","installment_1":""};
			            obj.student_id=rows[i].student_id;
			            obj.student_name=rows[i].student_name;
			            obj.receipt_no=rows[i].receipt_no;
			            obj.fees=rows[i].fees;
			            obj.installment_1=rows[i].installment_1;
			            itemarr.push(obj);
			        }
		           	//console.log(JSON.stringify(itemarr));
					res.status(200).json({'returnval': itemarr});
		        } else {
		            res.status(200).json({'returnval': ''});
		        }
	        } else {
	          console.log(err);
	        }
	});
});
app.post('/datepickinsta1cheque',  urlencodedParser,function (req, res)
{
	var date={"installment_1Date":req.query.dates};
	var mode= {"modeofpayment1":"Cheque"};
	var schoolx=req.query.schol;
	    connection.query('select f.student_id, f.student_id, d.student_name, f.receipt_no, f.fees,f.installment_1, c.cheque_no, c.bank_name, c.cheque_date from student_fee f inner join student_details d on f.student_id = d.id inner join cheque_details c on f.student_id = c.student_id where ? and ? and d.school_id=?',[date, mode,schoolx],
       	function(err, rows){
       		var itemarr = new Array();
       		if(!err){
		       	if(rows.length>0){
			        for(var i=0;i<rows.length;i++){
			            var obj={"student_id":"","student_name":"","receipt_no":"","fees":"","installment_1":"","cheque_no":"","bank_name":"","cheque_date":"",};
			            obj.student_id=rows[i].student_id;
			            obj.student_name=rows[i].student_name;
			            obj.receipt_no=rows[i].receipt_no;
			            obj.fees=rows[i].fees;
			            obj.installment_1=rows[i].installment_1;
			            obj.cheque_no=rows[i].cheque_no;
			            obj.bank_name=rows[i].bank_name;
			            obj.cheque_date=rows[i].cheque_date;
			            itemarr.push(obj);
			        }
		           	//console.log(JSON.stringify(itemarr));
					res.status(200).json({'returnval': itemarr});
		        } else {
		            res.status(200).json({'returnval': ''});
		        }
	        } else {
	          console.log(err);
	        }
	});
});
app.post('/datepickinsta2',  urlencodedParser,function (req, res)
{
	var date={"installment_2Date":req.query.dates};
	var mode= {"modeofpayment2":"Cash"};
	var schoolx=req.query.schol;
	    connection.query('Select f.student_id, d.student_name, f.receipt_no, f.fees,f.installment_2 from student_fee f left join student_details d on f.student_id=d.id where ? and ? and d.school_id=?',[date, mode,schoolx],
       	function(err, rows){
       		var itemarr = new Array();
		if(!err){
	       	if(rows.length>0){
		        for(var i=0;i<rows.length;i++){
		            var obj={"student_id":"","student_name":"","receipt_no":"","fees":"","installment_1":""};
		            obj.student_id=rows[i].student_id;
		            obj.student_name=rows[i].student_name;
		            obj.receipt_no=rows[i].receipt_no;
		            obj.fees=rows[i].fees;
		            obj.installment_1=rows[i].installment_2;
		            itemarr.push(obj);
		        }
	           	//console.log(JSON.stringify(itemarr));
					res.status(200).json({'returnval': itemarr});
		        } else {
		            res.status(200).json({'returnval': ''});
		        }
        } else {
          console.log(err);
        }
	});
});
app.post('/datepickinsta2cheque',  urlencodedParser,function (req, res)
{

	var date={"installment_2Date":req.query.dates};
	var mode= {"modeofpayment2":"Cheque"};
	var schoolx=req.query.schol;
	    connection.query('select f.student_id, d.student_name, f.receipt_no, f.fees,f.installment_2, c.cheque_no, c.bank_name, c.cheque_date from student_fee f inner join student_details d on f.student_id = d.id inner join cheque_details c on f.student_id = c.student_id where ? and ? and d.school_id=?',[date, mode,schoolx],
       	function(err, rows){
       		var itemarr = new Array();
       		if(!err){
		       	if(rows.length>0){
			        for(var i=0;i<rows.length;i++){
			            var obj={"student_id":"","student_name":"","receipt_no":"","fees":"","installment_1":"","cheque_no":"","bank_name":"","cheque_date":"",};
			            obj.student_id=rows[i].student_id;
			            obj.student_name=rows[i].student_name;
			            obj.receipt_no=rows[i].receipt_no;
			            obj.fees=rows[i].fees;
			            obj.installment_1=rows[i].installment_2;
			            obj.cheque_no=rows[i].cheque_no;
			            obj.bank_name=rows[i].bank_name;
			            obj.cheque_date=rows[i].cheque_date;
			            itemarr.push(obj);
			        }
		           	//console.log(JSON.stringify(itemarr));
					res.status(200).json({'returnval': itemarr});
		        } else {
		            res.status(200).json({'returnval': ''});
		        }
	        } else {
	          console.log(err);
	        }
	});
});
app.post('/pending',  urlencodedParser,function (req, res)
{

	var schoolx=req.query.schol;
	    connection.query('Select f.student_id, d.student_name,f.fees,(f.installment_1+f.installment_2) as paid, (f.fees-f.discount_fee)-(f.installment_1+f.installment_2) as pending from student_fee f left join student_details d on f.student_id=d.id where (((f.fees-f.discount_fee)-(f.installment_1+f.installment_2))>0) and d.school_id=?',[schoolx],
	function(err, rows){
		if(!err){
			if(rows.length>0)
			{
				res.status(200).json({'returnval': rows});
				//console.log(rows);
			} else {
				console.log(err);
				res.status(200).json({'returnval': 'invalid'});
			}
		} else {
			console.log(err);
		}
	});
});

app.post('/getpassdetail',  urlencodedParser,function (req, res)

{

	var date4={"student_id":req.query.stid};
	    connection.query('Select * from student_point where ?',[date4],
       	function(err, rows){
		if(!err){
			if(rows.length>0)
			{
				res.status(200).json({'returnval': rows});
				//console.log(rows);
			} else {
				console.log(err);
				res.status(200).json({'returnval': 'invalid'});
			}
		} else {
			console.log(err);
		}
	});
});


app.post('/getpointname',  urlencodedParser,function (req, res)
{

	var date5={"id":req.query.point};
	    connection.query('Select distinct point_name from point where ?',[date5],
       	function(err, rows){
		if(!err){
			if(rows.length>0)
			{
				res.status(200).json({'returnval': rows});
			} else {
				console.log(err);
				res.status(200).json({'returnval': 'invalid'});
			}
		} else {
			console.log(err);
		}
	});
});

app.post('/getroutename',  urlencodedParser,function (req, res)
{
	
	var date5={"id":req.query.route};
	    connection.query('Select distinct route_name from route where ?',[date5],
       	function(err, rows){
		if(!err){
			if(rows.length>0)
			{
				res.status(200).json({'returnval': rows});
			} else {
				console.log(err);
				res.status(200).json({'returnval': 'invalid'});
			}
		} else {
			console.log(err);
		}
	});
});

app.post('/getpassname',  urlencodedParser,function (req, res)
{

	var date5={"student_name":req.query.stid};
	    connection.query('Select * from student_details where ?',[date5],
       	function(err, rows){
		if(!err){
			if(rows.length>0)
			{
				res.status(200).json({'returnval': rows});
			} else {
				console.log(err);
				res.status(200).json({'returnval': 'invalid'});
			}
		} else {
			console.log(err);
		}
	});
});


app.post('/getzonedetail',  urlencodedParser,function (req, res)
{
	
	var date5={"student_id":req.query.stid};
	var schoolx={"school_id":req.query.schol};
	    connection.query('select zone_name from md_zone where id in (SELECT `zone_id` FROM `student_fee` WHERE `student_id` in (SELECT `id` FROM `student_details` WHERE ? or ?))',[date5, schoolx],
       	function(err, rows){
		if(!err){
			if(rows.length>0)
			{
				res.status(200).json({'returnval': rows});
			} else {
				console.log(err);
				res.status(200).json({'returnval': 'invalid'});
			}
		} else {
			console.log(err);
		}
	});
});



app.post('/getpassclass',  urlencodedParser,function (req, res)
{

	var date5={"id":req.query.class};
	    connection.query('Select * from class_details where ?',[date5],
       	function(err, rows){
		if(!err){
			if(rows.length>0)
			{
				res.status(200).json({'returnval': rows});
			} else {
				console.log(err);
				res.status(200).json({'returnval': 'invalid'});
			}
		} else {
			console.log(err);
		}
	});
});

app.post('/getparentinfo',  urlencodedParser,function (req, res)
{
	var schoolx={"school_id":req.query.schol};
	var date4={"student_id":req.query.stid};
	    connection.query('Select * from parent where ? and ?',[date4,schoolx],
       	function(err, rows){
		if(!err){
			if(rows.length>0)
			{
				//console.log(rows);
				res.status(200).json({'returnval': rows});
			} else {
				console.log(err);
				res.status(200).json({'returnval': 'invalid'});
			}
		} else {
			console.log(err);
		}
	});
});

app.post('/receiptsequence',  urlencodedParser,function (req, res)
{
	var schoolx={"school_id":req.query.schol};
	    connection.query('Select * from receiptsequence where ?',[schoolx],
       	function(err, rows){
		if(!err){
			if(rows.length>0)
			{
				res.status(200).json({'returnval': rows});
			} else {
				console.log(err);
				res.status(200).json({'returnval': 'invalid'});
			}
		} else {
			console.log(err);
		}
	});
});


app.post('/acksequence',  urlencodedParser,function (req, res)
{
	var schoolx={"school_id":req.query.schol};
	    connection.query('Select * from acksequence where ?',[schoolx],
       	function(err, rows){
		if(!err){
			if(rows.length>0)
			{
				res.status(200).json({'returnval': rows});
			} else {
				console.log(err);
				res.status(200).json({'returnval': 'invalid'});
			}
		} else {
			console.log(err);
		}
	});
});




app.post('/updatereceiptsequence',  urlencodedParser,function (req, res)
{
	var scid={"school_id":req.query.schoolid};
    var seq=req.query.sequence;
    var ackseq=req.query.ackseq;
	    connection.query('update receiptsequence set sequence=? , ackseq=?  where ? ',[seq,ackseq,scid],
       	function(err, rows){
		if(!err)
		{

				res.status(200).json({'returnval': 'success'});

		}
		 else {
			console.log(err);
		}
	});
});

app.post('/updateacksequence',  urlencodedParser,function (req, res)
{
	var scid={"schoolid":req.query.schoolid};
    var seq=req.query.sequence;
	    connection.query('update acksequence set ackseq=?+1  where ? ',[seq,scid],
       	function(err, rows){
		if(!err)
		{

				res.status(200).json({'returnval': 'success'});

		}
		 else {
			console.log(err);
		}
	});
});

app.post('/receiptnoinfee',  urlencodedParser,function (req, res)
{
	var rid;
	if(req.query.installtype=="installment1")
	{
	 rid={"receipt_no1":req.query.receiptno};
    }
    else
    {
     rid={"receipt_no2":req.query.receiptno};
    }
    var sid={"student_id":req.query.studid};
    var schoolx={"school_id":req.query.schol};
    console.log(req.query.installtype);
    console.log(rid);
	    connection.query('update student_fee set ?  where ? and ?',[rid,sid,schoolx],
       	function(err, rows){
		if(!err)
		{

				res.status(200).json({'returnval': 'success'});

		}
		 else {
			console.log(err);
		}
	});
});

app.post('/acknoinfee',  urlencodedParser,function (req, res)
{
	var rid;
	if(req.query.installtype=="installment1")
	{
	 rid={"receipt_no1":req.query.ackno};
    }
    else
    {
     rid={"receipt_no2":req.query.ackno};
    }
    var sid={"student_id":req.query.studid};

    var schoolx={"school_id":req.query.schol};
     console.log(req.query.installtype);
    console.log(rid);
	    connection.query('update student_fee set ?  where ? and ?',[rid,sid,schoolx],
       	function(err, rows){
		if(!err)
		{

				res.status(200).json({'returnval': 'success'});

		}
		 else {
			console.log(err);
		}
	});
});
app.post('/getstureceipt',  urlencodedParser,function (req, res)
{
	var stuid=req.query.stid;
	var schoolx={"school_id":req.query.schol};
	    connection.query('select student_name ,(select class from class_details where id=class_id) as classname, (select section from class_details where id=class_id) as section from student_details where id= ? and ?',[stuid,schoolx],
       	function(err, rows){
		if(!err){
			if(rows.length>0)
			{
				res.status(200).json({'returnval': rows});
			} else {
				console.log(err);
				res.status(200).json({'returnval': 'invalid'});
			}
		} else {
			console.log(err);
		}
	});
});

app.post('/refundcheque',  urlencodedParser,function (req, res)
{
	var dat=req.query.chequedate;
	var d=new Date(dat);
	var studid={"student_id":req.query.studid,"student_name":req.query.name,"cheque_no":req.query.chequenum,"bank_name":req.query.bankname,"cheque_date":d,"school_id":req.query.schol};
	    connection.query('insert into refund set ?',[studid],
       	function(err, rows){
		if(!err){

				res.status(200).json({'returnval': 'success'});
			}
		 else {
			console.log(err);
		}
	});
});


app.post('/updaterefundcheque',  urlencodedParser,function (req, res)
{
var student_id = {"student_id":req.query.studid};
var schoolx={"school_id":req.query.schol};
connection.query('update cancellation set flag=1,status="closed" where ? and ?',[student_id,schoolx],
       	function(err, rows)
       	{
       	if(!err){
			//console.log('suc');
				res.status(200).json({'returnval': 'success'});
			}
		 else {
			console.log(err);
		}
	});
});


app.post('/updaterecpno',  urlencodedParser,function (req, res)
{
	var scid={"receipt_no":req.query.recpno};
    var schoolx={"student_id":req.query.stid,"school_id":req.query.schol};
	    connection.query('update student_fee set ?  where ? ',[scid,schoolx],
       	function(err, rows){
		if(!err)
		{

				res.status(200).json({'returnval': 'success'});

		}
		 else {
			console.log(err);
		}
	});
});
app.post('/selectclasses',  urlencodedParser,function (req, res){
	connection.query('select class, section, id from class_details',
       	function(err, rows){
		if(!err){
			if(rows.length>0)
			{
				res.status(200).json({'returnval': rows});
			} else {
				console.log(err);
				res.status(200).json({'returnval': ''});
			}
		} else {
			console.log(err);
		}
	});
});

app.post('/addstudent',  urlencodedParser,function (req, res){
	var collection={"id":req.query.student_id, "student_name":req.query.student_name,"class_id":req.query.stu_class,"school_type":req.query.stu_schooltype, "transport_required":req.query.stu_transport,"school_id":req.query.schol,"dob":req.query.dob};
    connection.query('insert into student_details set ?',[collection],
       	function(err, rows){
		if(!err){

				res.status(200).json({'returnval':'success'});
				//console.log(rows);

		} else {
			console.log(err);
		}
	});
});


app.post('/addparent',  urlencodedParser,function (req, res){
	var collection={"student_id":req.query.student_id,"parent_name":req.query.parentname,"email":req.query.pemail,"mobile":req.query.pmobile,"address1":req.query.addr1,"address2":req.query.addr2,"address3":req.query.addr3,"city":req.query.city,"pincode":req.query.pincode,"school_id":req.query.schol};
    connection.query('insert into parent set ?',[collection],
       	function(err, rows){
		if(!err){

				res.status(200).json({'returnval':'sucess'});
				//console.log(rows);
			}
		 else {
			console.log(err);
		}
	});
});

function setvalue()
{
	console.log("calling setvalue.....");
}

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
