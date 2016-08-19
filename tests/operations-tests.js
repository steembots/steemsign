// operation test
// It templates

for(let op in operation) {
    switch(op) {
    case "operation" : continue
    }
    console.log(operation[op])
    //template(operation[op])
}

function template(op) {
    assert(op.toObject({}, {use_default: true}))
    assert(op.toObject({}, {use_default: true, annotate: true}))
    
    // sample json
    let obj = op.toObject({}, {use_default: true, annotate: false})
    // console.log(" ", op.operation_name, "\t", JSON.stringify(obj), "\n")
}
